// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { testFunc } from "./testcode";
import { streamFilesInDirectory } from "./streamdatatest";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "suscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand("suscode.helloWorld", () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage("Hello World from Suscode!");
	}
	);

	const huh = vscode.commands.registerCommand("suscode.filetest", async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from Suscode!');

		// this is testing the original version of Joyce's code
		let hey = await testFunc();
		console.log('im outside');
		console.log('hey', hey);
		console.log('im tottallyyy outside');
	});


	const directoryReading = vscode.commands.registerCommand("suscode.betterStreamTest", () => {
		const panel = vscode.window.createWebviewPanel(
			'suscode',
			'Reading Through Directories',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		// Send initial HTML to the webview
		panel.webview.html = getWebviewContent();

		// Stream files using the imported function
		// streamFilesInDirectory('rat-hooker', panel);
		streamFilesInDirectory('wallabyjs.quokka-vscode-1.0.649', panel);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(huh);
	context.subscriptions.push(directoryReading);

}

// Function to provide initial HTML content to the webview
function getWebviewContent(): string {
	return `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>File Stream</title>
	  </head>
	  <body>
		<h1>Streaming Files</h1>
		<div id="content"></div>
		<script>
		  const vscode = acquireVsCodeApi();
  
		  window.addEventListener('message', event => {
			const message = event.data;
			const contentDiv = document.getElementById('content');
  
			if (message.command === 'update') {
			  contentDiv.innerText += message.text;
			} else if (message.command === 'end') {
			  contentDiv.innerHTML += '<hr/><strong>Finished reading ' + message.fileName + '</strong><hr/>';
			} else if (message.command === 'error') {
			  contentDiv.innerHTML += '<p style="color:red;">' + message.text + '</p>';
			}
		  });
		</script>
	  </body>
	  </html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
