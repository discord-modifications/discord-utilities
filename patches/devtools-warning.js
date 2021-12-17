const ipcRenderer = DiscordUtilities.executeJS(`Object.keys(require('electron').ipcRenderer)`).slice(3).reduce((newElectron, key) => {
   newElectron[key] = DiscordUtilities.executeJS(`require('electron').ipcRenderer[${JSON.stringify(key)}].bind(require('electron').ipcRenderer)`);

   return newElectron;
}, {});

export default {
   displayName: 'DevTools Warning',
   id: 'devtools-warning',
   default: true,
   executor: async () => {
      ipcRenderer.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING');

      return () => {
         ipcRenderer.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING', false);
      };
   }
};