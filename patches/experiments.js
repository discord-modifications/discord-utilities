import Webpack from '../modules/webpack.js';

export default {
   displayName: 'Experiments',
   id: 'experiments',
   executor: async () => {
      await Webpack.whenReady;

      const Experiments = Webpack.findByProps('isDeveloper');
      Experiments._isDeveloper = Experiments.isDeveloper;
      Object.defineProperty(Experiments, 'isDeveloper', {
         get: () => true
      });

      Experiments._changeCallbacks.forEach(c => c());

      return () => {
         Experiments.isDeveloper = Experiments._isDeveloper;
         Experiments._changeCallbacks.forEach(c => c());
      };
   }
};