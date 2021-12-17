const { contextBridge } = require('electron');
const path = require('path');

const DiscordUtilites = {
   executeJS(js) {
      return eval(js);
   },
   getBasePath() {
      return path.resolve(__dirname, "..");
   }
};

// Expose internals
window.DiscordUtilites = DiscordUtilites;
contextBridge.exposeInMainWorld('DiscordUtilities', DiscordUtilites);