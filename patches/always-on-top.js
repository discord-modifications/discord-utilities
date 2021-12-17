const ipcRenderer = DiscordUtilities.executeJS(`Object.keys(require('electron').ipcRenderer)`).slice(3).reduce((newElectron, key) => {
   newElectron[key] = DiscordUtilities.executeJS(`require('electron').ipcRenderer[${JSON.stringify(key)}].bind(require('electron').ipcRenderer)`);

   return newElectron;
}, {});

export default {
   displayName: 'Always On Top',
   id: 'always-on-top',
   default: false,
   executor: async () => {
      ipcRenderer.send('DISCORD_UTILITIES_ALWAYS_ON_TOP', true);

      return () => {
         ipcRenderer.send('DISCORD_UTILITIES_ALWAYS_ON_TOP', false);
      };
   }
};