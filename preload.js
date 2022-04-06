const { contextBridge } = require('electron');
const manifest = require('./index.json');
const path = require('path');

const DiscordUtilites = {
   executeJS(js) {
      return eval(js);
   },
   getBasePath() {
      return path.resolve(__dirname, "..");
   },
   manifest
};

// Expose internals
window.DiscordUtilites = DiscordUtilites;
contextBridge.exposeInMainWorld('DiscordUtilities', DiscordUtilites);