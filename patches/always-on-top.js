import { ipcRenderer } from '../node/electron.js';

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