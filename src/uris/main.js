(function () {
  const vscode = acquireVsCodeApi();

  document
    .querySelector('.get-extensions-button')
    .addEventListener('click', () => {
      vscode.postMessage({ type: 'getExtensions' });
    });

  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'displayExtensions': {
        function displayExtensions(extensions) {
          const exButtons = document.querySelector('.extensions-list');
          // const exButton = document.createElement('button');
          // exButton.className = 'extensionButton';
          // exButton.innerText = extensions[1];
          // exButton.addEventListener('click', (e) => {
          //   clickHandler(extension);
          // });
          // exButtons.appendChild(exButton);

          for (const extension of extensions) {
            const exButton = document.createElement('button');
            exButton.className = 'extensionButton';
            exButton.innerText = extension[0];
            exButton.addEventListener('click', (e) => {
              clickHandler(extension[1]);
            });
            // exButton.addAttribute =
            //   ('onClick',
            //   () => {
            //     clickHandler(extension);
            //   });
            exButtons.appendChild(exButton);
          }
        }
        displayExtensions(message.value);
      }
    }
  });

  function clickHandler(extensionPath) {
    vscode.postMessage({ type: 'extensionSelected', value: extensionPath });
  }
})();
