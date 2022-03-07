import Patchers from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = Patchers.create('no-track');

export default {
   displayName: 'No-Track',
   id: 'no-track',
   default: true,
   executor: async () => {
      await Webpack.whenReady;

      const [
         Analytics,
         Reporter,
         Handlers
      ] = Webpack.findByProps(
         ['getSuperPropertiesBase64'],
         ['submitLiveCrashReport'],
         ['analyticsTrackingStoreMaker'],
         { bulk: true }
      );

      Patcher.instead(Analytics, 'track', () => { });
      Patcher.instead(Handlers.AnalyticsActionHandlers, 'handleTrack', () => { });
      Patcher.instead(Reporter, 'submitLiveCrashReport', () => { });

      if (window.__SENTRY__) {
         const Sentry = {
            main: window.__SENTRY__.hub,
            client: window.__SENTRY__.hub.getClient()
         };

         Sentry.client.close();
         Sentry.main.getStackTop().scope.clear();
         Sentry.main.getScope().clear();
         Patcher.instead(Sentry.main, 'addBreadcrumb', () => { });

         window.__oldConsole = window.console;

         for (const method of ['debug', 'info', 'warn', 'error', 'log', 'assert']) {
            const instance = console[method];
            if (!instance) continue;

            if (instance.__sentry_original__) {
               console[method] = instance.__sentry_original__;
            } else if (instance.__REACT_DEVTOOLS_ORIGINAL_METHOD__) {
               const original = instance.__REACT_DEVTOOLS_ORIGINAL_METHOD__.__sentry_original__;
               console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__ = original;
            }
         }
      }

      return () => {
         Patcher.unpatchAll();
         if (window.__SENTRY__) {
            Sentry.client.getOptions().enabled = true;
            window.console = window.__oldConsole;
         }
      };
   }
};