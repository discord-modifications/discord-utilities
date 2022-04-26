const { ipcMain, BrowserWindow } = require('electron');

ipcMain.on('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', (event, width, height) => {
   const window = BrowserWindow.fromWebContents(event.sender);
   window.setMinimumSize(width, height);
});

ipcMain.on('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING', (event, enable) => {
   event.sender.removeAllListeners('devtools-opened');
});

ipcMain.on('DISCORD_UTILITIES_ALWAYS_ON_TOP', (event, enabled) => {
   if (!enabled || typeof enabled !== 'boolean') {
      throw new TypeError('The "enabled" argument should be of type boolean.');
   }

   const window = BrowserWindow.fromWebContents(event.sender);
   if (!window) return;

   window.setAlwaysOnTop(enabled);
});