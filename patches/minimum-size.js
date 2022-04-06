import { ipcRenderer } from '../node/electron.js';

export default {
   displayName: 'Remove Minimum Size',
   id: 'remove-minimum-size',
   executor: async () => {
      ipcRenderer.send('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', 1, 1);

      return () => {
         ipcRenderer.send('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', 940, 500);
      };
   }
};