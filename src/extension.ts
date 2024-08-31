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
//this function gets invoked when the extension is ran/opened
//A view provider is required to have a webview in the sidebar, so we create a class down below and then initialize new instance of the class  within activat() called ExtensionsSidebarViewProvider
//We register the sidebar webview provider and assign it to the variable 'sidebar'
//register suscode.displayExtensions command that invokes getExtensions() to get the extension names and filepaths as a nested array, assigns that to 'extensionsList', and then invokes the displayExtensions method on ExtensionsSidebarViewProvider
//displayExtensions() posts a message to the sidebar with the type 'displayExtensions' and sends the extensionsList as the value of the message. This is received in sidebarApp.tsx
export function activate(context: vscode.ExtensionContext) {
  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  const sidebar = vscode.window.registerWebviewViewProvider(
    ExtensionsSidebarViewProvider.viewType,
    provider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('suscode.displayExtensions', () => {
      console.log('Command "suscode.displayExtensions" executed');
      const extensions = getExtensions();
      provider.displayExtensions(extensions);

      function getExtensions() {
        const extensions = vscode.extensions.all.filter(
          (extension) => !extension.id.startsWith('vscode.')
        );
        const extensionsList = extensions.map((extensionObj) => {
          let displayName = extensionObj.packageJSON.displayName;
          let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
          return [displayName, extensionPath];
        });
        //check if we need spread and array
        return [...extensionsList];
      }
    })
  );

  // Automatically execute the 'suscode.displayExtensions' command when the extension is activated
  //may not need
  vscode.commands.executeCommand('suscode.displayExtensions');

  ////////////////////////////////////////////////////////
  // Register a command to create a new webview panel to display scan results
  ////////////////////////////////////////////////////////
  const openResultPanel = vscode.commands.registerCommand(
    'suscode.openResultPanel',
    (extensionScan) => {
      // Create a new webview panel to display the results
      const panel = vscode.window.createWebviewPanel(
        'extensionScans',
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

      extensionScan = extensionScan[0].slice(1, -1);
      console.log(extensionScan);
      reader(extensionScan, panel);
    }
  );

  context.subscriptions.push(openResultPanel, sidebar);
}

class ExtensionsSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ExtensionsSidebarViewProvider';

  private _view?: vscode.WebviewView;
  private _isInitialized = false;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  // Method to resolve and initialize the webview when it is displayed
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log('WebviewView is being resolved');
    this._view = webviewView;
    this._isInitialized = true;

    // Set webview options, including enabling scripts and setting local resource roots
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    // Set the HTML content for the webview
    webviewView.webview.html = this.getWebviewHTML(webviewView.webview);

    // Handle messages received from the webview
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

  public displayExtensions(extensions: any[] | undefined) {
    if (this._isInitialized && this._view) {
      // Show the webview and send the extensions data
      this._view.show?.(true);
      this._view.webview.postMessage({
        type: 'displayExtensions',
        value: extensions,
      });
    } else {
      console.error('Webview is not initialized');
    }
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

    // Replace placeholders in the HTML with actual URIs and nonce
    htmlContent = htmlContent
      .replace(/\${nonce}/g, nonce)
      .replace(/\${scriptUri}/g, scriptUri.toString());

    console.log('Generated HTML Content:', htmlContent);

    return htmlContent;
  }
}

export function deactivate() {}
