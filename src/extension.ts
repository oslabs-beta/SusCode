import * as vscode from 'vscode';
import path from 'path';
import App from './sidebar/sidebarApp';
import fs from 'fs';
import { DisplaySettings } from '@mui/icons-material';

export function activate(context: vscode.ExtensionContext) {
  // const panel = vscode.window.createWebviewPanel(
  //   'extensionScans',
  //   'SusCode Results',
  //   vscode.ViewColumn.One,
  //   {
  //     enableScripts: true,
  //   }
  // );

  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  const sidebar = vscode.window.registerWebviewViewProvider(
    ExtensionsSidebarViewProvider.viewType,
    provider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'suscode.displayExtensions',
      (ExtensionsSidebarViewProvider) => {
        console.log('command registered');
        const extensions = getExtensions();
        // provider.displayExtensions(extensions); //-->
        function getExtensions() {
          const extensions = vscode.extensions.all.filter(
            (extension) => !extension.id.startsWith('vscode.')
          );
          const extensionsList = extensions.map((extensionObj) => {
            let displayName = extensionObj.packageJSON.displayName;
            let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
            return [displayName, extensionPath];
          });
          return [...extensionsList];
        }

        // sidebar.displayExtensions(extensions)
        ExtensionsSidebarViewProvider.webview.postMessage({
          type: 'displayExtensions',
          value: extensions,
          targetOrigin: sidebar,
        });
      }
    )
  );

  vscode.commands.executeCommand(
    'suscode.displayExtensions',
    ExtensionsSidebarViewProvider
  );

  ////////////////////////////////////////////////////////
  // Panel
  ////////////////////////////////////////////////////////
  const scanWindow = vscode.commands.registerCommand(
    'scanExtension',
    (extensionScan, context) => {
      const panel = vscode.window.createWebviewPanel(
        'extensionScans',
        'SusCode Results',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      const htmlPath = path.join(
        context.extensionPath,
        // vscode.extensionPath,
        'src',
        'panel',
        'panelIndex.html'
      );

      // Read the HTML content from the file
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');

      // Get the webview URI for the JavaScript file
      // const scriptUri = webview.asWebviewUri(
      //   vscode.Uri.file(
      //     path.join(this._extensionUri.fsPath, 'dist', 'panel.js')
      //   )
      // );

      // Replace CSP and asset URIs in the HTML content
      // htmlContent = htmlContent
      //   .replace(/\${nonce}/g, nonce) // Replace the nonce placeholder
      //   .replace(/\${webview\.cspSource}/g, webview.cspSource) // Replace the webview.cspSource placeholder
      //   .replace('../../dist/panel.js', scriptUri.toString()); // Replace the script path with webview URI

      panel.webview.html = htmlContent;
      console.log('htmlContent within panel', htmlContent);
    }
  );
  context.subscriptions.push(scanWindow, sidebar);

  ////////////////////////////////////////////////////////
}

class ExtensionsSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ExtensionsSidebarViewProvider';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this.getWebviewHTML(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'getExtensions': {
          vscode.commands.executeCommand('suscode.displayExtensions');
          break;
        }
        case 'extensionSelected': {
          console.log('extension selected!');
          const extensionsScan = JSON.stringify(data.value);
          vscode.commands.executeCommand('scanExtension', data.value);
          break;
        }
      }
    });
  }
  public getWebviewHTML(webview: vscode.Webview) {
    // Generate a nonce for the script to be used in the CSP

    // Path to your HTML file
    const htmlPath = path.join(
      this._extensionUri.fsPath,
      'src',
      'sidebar',
      'sidebarIndex.html'
    );

    // Read the HTML content from the file
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Get the webview URI for the JavaScript file
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._extensionUri.fsPath, 'dist', 'sidebar.js')
      )
    );

    // Replace CSP and asset URIs in the HTML content
    htmlContent = htmlContent
      .replace(/\${nonce}/g, nonce) // Replace the nonce placeholder
      .replace(/\${webview\.cspSource}/g, webview.cspSource) // Replace the webview.cspSource placeholder
      .replace('../../dist/sidebar.js', scriptUri.toString()); // Replace the script path with webview URI

    console.log('htmlContent within sidebar', htmlContent);

    return htmlContent;
  }

  public displayExtensions(extensions: any[] | undefined) {
    console.log('within displayExtensions');
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({
        type: 'displayExtensions',
        value: extensions,
      });
    }
  }
}
// function getExtensions() {
//   const extensions = vscode.extensions.all.filter(
//     (extension) => !extension.id.startsWith('vscode.')
//   );
//   const extensionsList = extensions.map((extensionObj) => {
//     let displayName = extensionObj.packageJSON.displayName;
//     let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
//     return [displayName, extensionPath];
//   });
//   return [...extensionsList];
// }

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
export function deactivate() {}
