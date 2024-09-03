import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { reader } from './fileFinder';

// generates a unique key used for script security
function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
const nonce = getNonce();

//=========================ACTIVATE==================================================//
// * this function gets invoked when the extension is ran/opened
// * A view provider is required to have a webview in the sidebar, so we create a class
//   down below and then initialize new instance of the class  within activate() called
//   ExtensionsSidebarViewProvider
// * We register the sidebar webview provider and assign it to the variable 'sidebar'
// * We register suscode.displayExtensions command that invokes getExtensions() to get
//   the extension names and filepaths as a nested array, assigns that to 'extensionsList',
//   and then invokes the displayExtensions method on ExtensionsSidebarViewProvider
// * Then displayExtensions() posts a message to the sidebar with the type 'displayExtensions'
//   and sends the extensionsList as the value of the message. This is received in sidebarApp.tsx
// * We register suscode.openResultPanel command which when executed will invoke the anonymous
//   function that takes a 'filepath' parameter to create a webview and assign it to the variable 'panel'
// * ----> we use getPanelHTML() to locate the panelIndex.html, read the contents, create
//         a path to the bundled file 'panel.js' and replace the script with a URI to the bundle,
//         as well as replace nonce with the variable defined globally on this file
// * ----> we take the passed in filepath and use slice(1, -1) to remove extra quotation
//         marks before invoking reader(filepath, panel), which is imported from fileFinder.ts
export function activate(context: vscode.ExtensionContext) {
  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  const sidebar = vscode.window.registerWebviewViewProvider(
    ExtensionsSidebarViewProvider.viewType,
    provider
  );

  const displayExtensions = vscode.commands.registerCommand(
    'suscode.displayExtensions',
    () => {
      function getExtensions() {
        const extensions = vscode.extensions.all.filter(
          (extension) => !extension.id.startsWith('vscode.')
        );
        const extensionsList = extensions.map((extensionObj) => {
          let displayName = extensionObj.packageJSON.displayName;
          let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
          return [displayName, extensionPath];
        });
        return extensionsList;
      }
      const extensions = getExtensions();
      provider.displayExtensions(extensions);
    }
  );

  const openResultPanel = vscode.commands.registerCommand(
    'suscode.openResultPanel',
    (filepath) => {
      const panel = vscode.window.createWebviewPanel(
        'resultPanel',
        'SusCode Results',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionUri.fsPath, 'dist')),
          ],
        }
      );

      function getPanelHTML() {
        const htmlPath = path.join(
          context.extensionUri.fsPath,
          'src',
          'panel',
          'panelIndex.html'
        );
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const scriptUri = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionUri.fsPath, 'dist', 'panel.js')
          )
        );

        htmlContent = htmlContent
          .replace(/\${nonce}/g, nonce)
          .replace(/\${scriptUri}/g, scriptUri.toString());

        return htmlContent;
      }
      panel.webview.html = getPanelHTML();

      filepath = filepath[0].slice(1, -1);
      reader(filepath, panel);
    }
  );

  context.subscriptions.push(sidebar, displayExtensions, openResultPanel);
}

//=========================ExtensionsSidebarViewProvider================================//
// * this class implements a webview view provider, allowing us to create a webview
//   in the sidebar ('explorer')
// * it starts by setting the viewType, which is found in package.json under views,
//   then handles some vscode API private labeling and establishes a URI to the webviewView
//   with the label _extensionURI
// * the resolveWebviewView() initializes the webview, sets the context and creates
//   a _view variable, before setting the options to enable scripts and set localSourceRoots
// * ----> this function also uses getWebviewHTML (defined outseid of the resolveWebviewFunction)
//         and sets the evaluated result as the html for the webview
// * ----> this function also establishes an event listener:
// * window.addEventListener listens for 'getExtensions' coming from sidebarApp.tsx when a user
//   clicks the 'get extensions' button, and will execute the suscode.displayExtension command
// * window.addEventListener also listens for 'extensionSelected' coming from sidebarApp.tsx when
//   a user clicks/selects an extension, and will execute the suscode.openResultPanel command
//   passing in the filepath which was the value of the message it received.
// * getWebviewHTML locates the sidebarIndex.html, reads the contents, creates a path to the
//   bundled file 'sidebar.js' and replace the script with a URI to the bundle, as well as replace
//   nonce with the variable defined globally on this file
// * We export the default function deactivate() to shut down the extension when it is closed.

class ExtensionsSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ExtensionsSidebarViewProvider';
  private _view?: vscode.WebviewView;
  private _isInitialized = false;
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    this._isInitialized = true;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewHTML(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      console.log('Message received:', data);
      switch (data.type) {
        case 'getExtensions': {
          vscode.commands.executeCommand('suscode.displayExtensions');
          break;
        }
        case 'extensionSelected': {
          const filepath: string = data.value;
          vscode.commands.executeCommand('suscode.openResultPanel', filepath);
          break;
        }
      }
    });
  }
  private getWebviewHTML(webview: vscode.Webview) {
    const htmlPath = path.join(
      this._extensionUri.fsPath,
      'src',
      'sidebar',
      'sidebarIndex.html'
    );
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._extensionUri.fsPath, 'dist', 'sidebar.js')
      )
    );

    htmlContent = htmlContent
      .replace(/\${nonce}/g, nonce)
      .replace(/\${scriptUri}/g, scriptUri.toString());

    console.log('Generated HTML Content:', htmlContent);

    return htmlContent;
  }

  public displayExtensions(extensions: any[] | undefined) {
    if (this._isInitialized && this._view) {
      this._view.show?.(true);
      this._view.webview.postMessage({
        type: 'displayExtensions',
        value: extensions,
      });
    } else {
      console.error('Webview is not initialized');
    }
  }
}

export function deactivate() {}
