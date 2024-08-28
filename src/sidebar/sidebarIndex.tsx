const React = require('react');
const ReactDOM = require('react-dom/client');
import App from './sidebarApp';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './sidebarApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add the postMessage listener to handle messages from the VS Code extension
// window.addEventListener('message', (event) => {
//   const message = event.data; // The JSON data from the extension
//   if (message.command === 'cowsay') {
//     console.log('Cowsay command started!!!!');
//   }
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
 */
