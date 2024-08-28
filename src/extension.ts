import * as vscode from 'vscode';
import path from 'path';
import App from './sidebar/sidebarApp';
import fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  const sidebar = vscode.window.registerWebviewViewProvider(
    ExtensionsSidebarViewProvider.viewType,
    provider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('suscode.displayExtensions', () => {
      console.log('command registered');
      const extensions = getExtensions();
      provider.displayExtensions(extensions); //-->
    })
  );

  // const scanWindow = vscode.commands.registerCommand(
  //   'scanExtension',
  //   (extensionScan, context) => {
  //     const panel = vscode.window.createWebviewPanel(
  //       'extensionScans',
  //       'SusCode Results',
  //       vscode.ViewColumn.One,
  //       {
  //         enableScripts: true,
  //       }
  //     );

  //     const htmlPath = path.join(context.extensionPath, 'src', 'index.html');
  //     let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  //     // Replace paths in the HTML to be compatible with the webview
  //     htmlContent = htmlContent.replace(/(href|src)=“\//g, (match, p1) => {
  //       return `${p1}=“${panel.webview
  //         .asWebviewUri(
  //           vscode.Uri.file(path.join(context.extensionPath, 'src'))
  //         )
  //         .toString()}/`;
  //     });
  //     // Set the HTML content to the webview
  //     panel.webview.html = htmlContent;

  //     // panel.webview.html = getWebviewContent(extensionScan);
  //     // const scriptUri = panel.webview.asWebviewUri(
  //     //   vscode.Uri.joinPath(context.extensionURI, 'src', 'uris', 'main.js')
  //     // );
  //   }
  // );
  // context.subscriptions.push(scanWindow, sidebar);
  // sidebar.webview.html = getWebviewHTML;

  context.subscriptions.push(sidebar);

  console.log('Congratulations, your extension "suscode" is now active!');
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

    return htmlContent;
  }

  // public getNonce() {
  //   let text = '';
  //   const possible =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   for (let i = 0; i < 32; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }
  //   return text;
  // }
  // const nonce: string = this.getNonce();
  // public getWebviewHTML(webview: vscode.Webview) {
  //   // Generate a nonce
  //   const nonce = this.getNonce();

  //   // Path to your HTML file
  //   const htmlPath = path.join(
  //     this._extensionUri.fsPath,
  //     'src',
  //     'sidebar',
  //     'sidebarIndex.html'
  //   );

  //   // Read the HTML content from the file
  //   let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  //   // Replace placeholders for asset paths
  //   htmlContent = htmlContent.replace(/(href|src)="\//g, (match, p1) => {
  //     return `${p1}="${webview
  //       .asWebviewUri(
  //         vscode.Uri.file(path.join(this._extensionUri.fsPath, 'src'))
  //       )
  //       .toString()}/`;
  //   });

  //   // Replace CSP placeholders
  //   htmlContent = htmlContent
  //     .replace(/\${nonce}/g, nonce) // Replace the nonce placeholder
  //     .replace(/\${webview\.cspSource}/g, webview.cspSource); // Replace the webview.cspSource placeholder

  //   return htmlContent;
  // }

  // public getWebviewHTML(webview: vscode.Webview) {
  //   const htmlPath = path.join(
  //     this._extensionUri.fsPath,
  //     'src',
  //     'sidebar',
  //     'sidebarIndex.html'
  //   );
  //   let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  //   htmlContent = htmlContent.replace(/(href|src)="\//g, (match, p1) => {
  //     return `${p1}="${webview
  //       .asWebviewUri(
  //         vscode.Uri.file(path.join(this._extensionUri.fsPath, 'src'))
  //       )
  //       .toString()}/`;
  //   });
  //   const cspSource = webview.cspSource; // CSP source for styles

  //   htmlContent = htmlContent.replace(
  //     /<meta http-equiv="Content-Security-Policy"[^>]*>/,
  //     `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${cspSource};">`
  //   );
  //   return htmlContent;
  // }

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

// private _getHtmlForWebview(webview: vscode.Webview) {
// const scriptUri = webview.asWebviewUri(
//   vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'main.js')
// );
// const styleMainUri = webview.asWebviewUri(
//   vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'main.css')
// );
// const styleVSCodeUri = webview.asWebviewUri(
//   vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'vscode.css')
// );

//   return `<!DOCTYPE html>
//           <html lang="en">
//           <head>
//               <meta charset="UTF-8">

//               <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

//               <meta name="viewport" content="width=device-width, initial-scale=1.0">

//               <link href="${styleMainUri}" rel="stylesheet">
//               <link href="${styleVSCodeUri}" rel="stylesheet">

//               <title>SusCode</title>
//           </head>
//           <body class ="body">
//               <div class="main">
//                   <button class="get-extensions-button">Get Extensions</button>
//                   <div class="extensions-list"></div>
//               </div>
//               <script nonce="${nonce}" src="${scriptUri}"></script>
//           </body>
//           </html>`;
// }

//
