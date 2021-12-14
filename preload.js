const { contextBridge } = require('electron');

const DiscordUtilites = {
   executeJS(js) {
      return eval(js);
   }
};

// Expose internals
window.DiscordUtilites = DiscordUtilites;
contextBridge.exposeInMainWorld('DiscordUtilities', DiscordUtilites);