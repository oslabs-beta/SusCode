import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { reader } from './fileFinder';

// moved getNonce up here - starting getting an error when it was below function activate
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

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');

  // Create a new instance of ExtensionsSidebarViewProvider
  const provider = new ExtensionsSidebarViewProvider(context.extensionUri);

  // Register the sidebar webview view provider
  const sidebar = vscode.window.registerWebviewViewProvider(
    ExtensionsSidebarViewProvider.viewType,
    provider
  );

  // Register a command that, when executed, displays the extensions in the sidebar
  context.subscriptions.push(
    vscode.commands.registerCommand('suscode.displayExtensions', () => {
      console.log('Command "suscode.displayExtensions" executed');
      const extensions = getExtensions();
      provider.displayExtensions(extensions);

      // Helper function to filter out built-in VS Code extensions and return a list of user-installed extensions
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
    })
  );

  // Automatically execute the 'suscode.displayExtensions' command when the extension is activated
  vscode.commands.executeCommand('suscode.displayExtensions');

  ////////////////////////////////////////////////////////
  // Register a command to create a new webview panel to display scan results
  ////////////////////////////////////////////////////////
  const scanWindow = vscode.commands.registerCommand(
    'scanExtension',
    (extensionScan) => {
      // Create a new webview panel to display the results
      console.log('scanWindow executed with filepath: ', extensionScan);
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
      //-------------------------original from Seth's working react webview------------------//
      function getPanelHTML() {
        const htmlPath = path.join(
          context.extensionUri.fsPath,
          'src',
          'panel',
          'panelIndex.html'
          // 'dist',
          // 'webviews',
          // 'panelIndex.html'
        );
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Replace paths in the HTML to be compatible with the webview
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

      // Set the HTML content to the webview
      panel.webview.html = getPanelHTML();


	  extensionScan = extensionScan[0].slice(1,-1);
	  console.log(extensionScan);
	  reader(extensionScan, panel);

      //-------------------------old attempt-------------------------------------------//

      // .replace(/(href|src)="\//g, (match, p1) => {
      //   return `${p1}="${panel.webview
      //     .asWebviewUri(
      //       vscode.Uri.file(
      //         path.join(context.extensionUri.fsPath, 'dist', 'panel.js')
      //       )
      //     )
      //     .toString()}/`;
      // })

      // // Read the HTML content for the panel from a file
      // const htmlPath = path.join(
      //   context.extensionPath,
      //   'src',
      //   'panel',
      //   'panelIndex.html'
      // );
      // let htmlContent = fs.readFileSync(htmlPath, 'utf8');

      // // Replace relative paths in the HTML content to ensure resources are loaded correctly
      // htmlContent = htmlContent.replace(/(href|src)="\//g, (match, p1) => {
      //   return `${p1}="${panel.webview
      //     .asWebviewUri(
      //       vscode.Uri.file(path.join(context.extensionPath, 'src'))
      //     )
      //     .toString()}/`;
      // });

      // // Set the HTML content of the panel's webview
      // panel.webview.html = htmlContent;
      // console.log('htmlContent within panel', htmlContent);
    }
  );

  // Add the sidebar and scanWindow commands to the extension's subscriptions
  context.subscriptions.push(scanWindow, sidebar);
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
          // Command to retrieve and display extensions in the webview
          vscode.commands.executeCommand('suscode.displayExtensions');
          break;
        }
        case 'extensionSelected': {
          console.log(
            'extension selected! The extension filepath is: ',
            data.value
          );
          // Command to scan the selected extension
          vscode.commands.executeCommand('scanExtension', data.value);
          break;
        }
      }
    });
  }

  // Method to display extensions in the webview
  public displayExtensions(extensions: any[] | undefined) {
    console.log('within displayExtensions');
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

  // Method to get the HTML content for the webview, injecting necessary URIs and nonce
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

    const nonce = getNonce();

    // Replace placeholders in the HTML with actual URIs and nonce
    htmlContent = htmlContent
      .replace(/\${nonce}/g, nonce)
      .replace(/\${scriptUri}/g, scriptUri.toString());

    console.log('Generated HTML Content:', htmlContent);

    return htmlContent;
  }
}

export function deactivate() {}

/*
// Webview command
    vscode.commands.registerCommand('catCoding.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'catCoding',
			'SusCode',
			vscode.ViewColumn.One,
			{
				enableScripts: true, // Ensure scripts are enabled for the webview
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'my-app/build'))]
			}
		);
	
		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(
			(message) => {
				if (message.command === 'cowsay') {
					// Log to confirm the command was received
					console.log('cowsay command received, about to execute command...');
					
					// Execute the cowsay command
					vscode.commands.executeCommand('cowsay.say')
						.then(
							() => {
								console.log('cowsay.say command executed successfully.');
							},
							(error) => {
								console.error('Error executing cowsay.say command:', error);
							}
						);
				}
			},
			undefined,
			context.subscriptions
		);
	
		const htmlPath = path.join(context.extensionPath, 'my-app/build', 'index.html');
		let htmlContent = fs.readFileSync(htmlPath, 'utf8');
	
		// Replace paths in the HTML to be compatible with the webview
		htmlContent = htmlContent.replace(/(href|src)="\//g, (match, p1) => {
			return `${p1}="${panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'my-app/build'))).toString()}/`;
		});
	
		// Set the HTML content to the webview
		panel.webview.html = htmlContent;
    */
