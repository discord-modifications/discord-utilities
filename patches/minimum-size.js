const ipcRenderer = DiscordUtilities.executeJS(`Object.keys(require('electron').ipcRenderer)`).slice(3).reduce((newElectron, key) => {
   newElectron[key] = DiscordUtilities.executeJS(`require('electron').ipcRenderer[${JSON.stringify(key)}].bind(require('electron').ipcRenderer)`);

   return newElectron;
}, {});

export default {
   displayName: 'Remove Minimum Size',
   id: 'remove-minimum-size',
   default: true,
   executor: async () => {
      ipcRenderer.send('REMOVE_MINIMUM_SIZE', 1, 1);

      return () => {
         ipcRenderer.send('REMOVE_MINIMUM_SIZE', 940, 500);
      };
   }
};