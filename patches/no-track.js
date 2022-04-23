import Patchers from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = Patchers.create('no-track');

export default {
   displayName: 'No-Track',
   id: 'no-track',
   executor: async () => {
      await Webpack.whenReady;

      const blacklist = [
         'useAndTrack',
         'TextTrack'
      ];

      const Trackers = Webpack.findModules(m => typeof m === 'object' && Object.keys(m).some(e => ~e.toLowerCase().indexOf('track') && !blacklist.some(b => ~e.indexOf(b))));
      const Reporters = Webpack.findModules(m => typeof m === 'object' && Object.keys(m).some(e => ~e.toLowerCase().indexOf('crashreport') && !blacklist.some(b => ~e.indexOf(b))));

      for (let i = 0; i < Trackers.length; i++) {
         traverse(Trackers[i], key => ~key.toLowerCase().indexOf('track') && !blacklist.some(b => ~key.indexOf(b)));
      }

      for (let i = 0; i < Reporters.length; i++) {
         traverse(Reporters[i], key => ~key.toLowerCase().indexOf('crashreport') && !blacklist.some(b => ~key.indexOf(b)));
      }

      const Sentry = {
         main: window.__SENTRY__?.hub,
         client: window.__SENTRY__?.hub?.getClient()
      };

      if (Sentry.main && Sentry.client) {
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

         if (Sentry.main && Sentry.client) {
            Sentry.client.getOptions().enabled = true;
            window.console = window.__oldConsole;
         }
      };
   }
};

function traverse(object, filter) {
   const keys = [...Object.keys(object), ...Object.keys(object.__proto__)].filter(filter);

   for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!~['function', 'object'].indexOf(typeof object[key])) {
         continue;
      }

      if (typeof object[key] === 'object') {
         traverse(object[key], filter);
      } else {
         try {
            Patcher.instead(object, key, () => { });
         } catch { }
      }
   }
};