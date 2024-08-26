// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ExtensionsSidebarViewProvider.viewType,
      provider
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('suscode.displayExtensions', () => {
      console.log('command registered');
      provider.displayExtensions(extensions); //-->
    })
  );
  context.subscriptions.push(scanWindow);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "suscode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'suscode.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from Suscode!');
    }
  );

  context.subscriptions.push(disposable);
}
// how to open new webview in response to
const scanWindow = vscode.commands.registerCommand(
  'scanExtension',
  (extensionScan) => {
    const panel = vscode.window.createWebviewPanel(
      'extensionScans',
      'SusCode Results',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
    panel.webview.html = getWebviewContent(extensionScan);
  }
);

function getWebviewContent(extensionScan: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <h1> Scan Results Go Here</h1>
    <p>SusCode Extension Scan Results for ${extensionScan}</p>
</body>
</html>`;
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

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      //add function definition here to retrieve extension names
      function getExtensions() {
        const extensions = vscode.extensions.all.filter(
          (extension) => !extension.id.startsWith('vscode.')
        );
        const extensionsList = extensions.map((extensionObj) => {
          let displayName = extensionObj.packageJSON.displayName;
          let extensionPath = JSON.stringify(extensionObj.extensionUri.path);
          return [displayName, extensionPath];
          //JSON.stringify(extensionObj.extensionUri.path)
        });
        return [...extensionsList];
      }
      switch (data.type) {
        case 'getExtensions': {
          const extensions = getExtensions();
          this.displayExtensions(extensions);
          break;
        }
        case 'extensionSelected': {
          console.log('extension selected!');
          // const parsedData = data.json();
          const extensionsScan = JSON.stringify(data.value);
          vscode.commands.executeCommand('scanExtension', data.value);
          break;
        }
      }
    });
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

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'main.js')
    );

    // const scriptUri = webview.asWebviewUri(
    //   vscode.Uri.file(path.join(this._extensionUri, 'src', 'uris', 'main.js'))
    // );

    // Do the same for the stylesheet.
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'main.css')
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'src', 'uris', 'vscode.css')
    );

    // Use a nonce to only allow a specific script to be run.

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleMainUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">

				<title>SusCode</title>
			</head>
			<body class ="body">
				<div class="main">
					<button class="get-extensions-button">Get Extensions</button>
					<div class="extensions-list"></div>
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

const nonce = getNonce();
//---- do I need this? so that it has access to extensions above?----------//
// function getExtensions2() {
//   const extensions = vscode.extensions.all.filter(
//     (extension) => !extension.id.startsWith('vscode.')
//   );
//   const extensionsList = extensions.map((extensionObj) => {
//     return extensionObj.packageJSON.name;
//   });
//   return [...extensionsList];
// }
// const extensions = getExtensions2();

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This method is called when your extension is deactivated
export function deactivate() {}
