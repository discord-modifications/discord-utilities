import Webpack from '../modules/webpack.js';

export default {
   displayName: 'Persistent Token',
   id: 'persistent-token',
   default: true,
   executor: async () => {
      await Webpack.whenReady;

      const Token = Webpack.findByProps('hideToken');
      Token._hideToken = Token.hideToken;
      Token.hideToken = () => void 0;

      return () => {
         Token._hideToken = hideToken;
      };
   }
};