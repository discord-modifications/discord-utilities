import { ipcRenderer } from '../node/electron.js';

export default {
   displayName: 'DevTools Warning',
   id: 'devtools-warning',
   executor: async () => {
      ipcRenderer.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING');

      return () => {
         ipcRenderer.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING', false);
      };
   }
};