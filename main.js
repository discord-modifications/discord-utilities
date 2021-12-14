const { ipcMain, BrowserWindow } = require('electron');

ipcMain.on('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', (event, width, height) => {
   const window = BrowserWindow.fromWebContents(event.sender);
   window.setMinimumSize(width, height);
});

ipcMain.on('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING', (event) => {
   event.sender.removeAllListeners('devtools-opened');
});