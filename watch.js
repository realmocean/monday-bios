var chokidar = require('chokidar');
var shell = require('shelljs');

const notifier = require('node-notifier');

// String

  

const watcher = chokidar.watch('./src', {
    ignoreInitial:true
  });
  watcher.on('all', (event, path) => {
    if (shell.exec('npm run build').code !== 0) {
      notifier.notify(
        {
          title: 'Build Error',
          message: 'Please check your code.',
        
          sound: true, // Only Notification Center or Windows Toasters
          wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        },
        function (err, response, metadata) {
          // Response is response from notification
          // Metadata contains activationType, activationAt, deliveredAt
        }
      );
    }
  }); 