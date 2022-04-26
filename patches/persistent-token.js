import { create } from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = create('persistent-token');

export default {
   displayName: 'Persistent Token',
   id: 'persistent-token',
   executor: async () => {
      await Webpack.whenReady;

      const Token = Webpack.findByProps('hideToken');
      Patcher.instead(Token, 'hideToken', () => { });

      return () => Patcher.unpatchAll();
   }
};