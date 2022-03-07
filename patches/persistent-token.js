import Patchers from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = Patchers.create('persistent-token');

export default {
   displayName: 'Persistent Token',
   id: 'persistent-token',
   default: true,
   executor: async () => {
      await Webpack.whenReady;

      const Token = Webpack.findByProps('hideToken');
      Patcher.instead(Token, 'hideToken', () => { });

      return () => Patcher.unpatchAll();
   }
};