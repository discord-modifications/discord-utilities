import { ipcRenderer } from '../node/electron.js';

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