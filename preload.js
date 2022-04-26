const { ipcRenderer, contextBridge } = require('electron');
const path = require('path');

const manifest = require('./index.json');

const DiscordUtilites = {
   manifest,
   IPC: {
      send: (event, ...args) => {
         if (!~event.indexOf('DISCORD_UTILITIES')) {
            throw new Error('You may not send IPC events for anything else.');
         }

         return ipcRenderer.send(event, ...args);
      }
   },
   getBasePath() {
      return path.resolve(__dirname, '..');
   }
};

// Expose internals
window.DiscordUtilites = DiscordUtilites;
contextBridge.exposeInMainWorld('DiscordUtilities', DiscordUtilites);