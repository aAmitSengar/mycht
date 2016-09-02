// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer

//const errorBtn = document.getElementById('error-dialog')

//const informationBtn = document.getElementById('information-dialog')
//errorBtn.addEventListener('click', function (event) {
//  ipc.send('open-error-dialog')
//})



//informationBtn.addEventListener('click', function (event) {
//  ipc.send('open-information-dialog')
//})

//ipc.on('information-dialog-selection', function (event, index) {
//  let message = 'You selected '
//  if (index === 0) message += 'yes.'
//  else message += 'no.'
//  document.getElementById('info-selection').innerHTML = message
//})

const remote = require('electron').remote;
document.getElementById("min-btn-login").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    window.minimize();
});
document.getElementById("close-btn-login").addEventListener("click", function(e) {
    var window = remote.getCurrentWindow();
    window.close();
});
const notifier = require('node-notifier');
const path = require('path');

var windowsNotification = new Notification("Welcome", {
    body: "Welcome to chat Application",
    icon: path.join(__dirname, 'public', 'img', 'twc-logo.png')
});
windowsNotification.onshow = function() {
  //  alert("Notification shown")
};
windowsNotification.onclick = function() {
  //  alert("Notification clicked")
};
windowsNotification.onclose = function() {
  //  alert("Notification dismissed")
};

notifier.on('click', function(notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
});

notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
});
//  document.getElementById("max-btn").addEventListener("click", function (e) {
//       var window = remote.getCurrentWindow();
//       if (!window.isMaximized()) {
//           window.maximize();
//       } else {
//           window.unmaximize();
//       }
//  });
