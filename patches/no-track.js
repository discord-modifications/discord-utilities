import Patchers from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = Patchers.create('no-track');

const blacklist = [
   'useTrackThreadArchivalDurationUpsell',
   'useAndTrackNonFriendDMAccept',
   'StreamRTCAnalyticsContext',
   'useAndTrackDMSpamAccept',
   'useAnalyticsContext',
   'trackExposure',
   'useAndTrack',
   'TextTrack'
];

export default {
   displayName: 'No-Track',
   id: 'no-track',
   executor: async () => {
      await Webpack.whenReady;

      const Trackers = Webpack.findModules(m => typeof m === 'object' && [...Object.keys(m), ...Object.keys(m.__proto__), ...Object.keys(m.prototype ?? {})].some(e => (~e.toLowerCase().indexOf('track') || ~e.toLowerCase().indexOf('analytics'))));
      const Reporters = Webpack.findModules(m => typeof m === 'object' && [...Object.keys(m), ...Object.keys(m.__proto__), ...Object.keys(m.prototype ?? {})].some(e => ~e.toLowerCase().indexOf('crashreport')));

      for (let i = 0; i < Trackers.length; i++) {
         const filter = (key) => (~key.toLowerCase().indexOf('track') || ~key.toLowerCase().indexOf('analytics')) && !blacklist.some(b => key === b);
         const tracker = Trackers[i];

         traverse(tracker, filter);
         traverse(tracker.default, filter);
      }

      for (let i = 0; i < Reporters.length; i++) {
         const filter = (key) => ~key.toLowerCase().indexOf('crashreport') && !blacklist.some(b => key === b);
         const reporter = Reporters[i];

         traverse(reporter, filter);
         traverse(reporter.default, filter);
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
   if (!object || !filter) return;
   const keys = [
      ...Object.keys(object),
      ...Object.keys(object.__proto__),
      ...Object.keys(object.prototype ?? {})
   ].filter(filter);

   for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const type = typeof (object[key] ?? object.__proto__[key] ?? object.prototype?.[key]);
      if (!~['function', 'object'].indexOf(type) || blacklist.some(b => key === b)) {
         continue;
      }

      if (typeof object[key] === 'object') {
         traverse(object[key], filter);
      } else {
         if (object.prototype?.[key] && isConfigurable(object.prototype, key)) {
            Patcher.instead(object.prototype, key, () => Promise.resolve());
         } else if (object.__proto__[key] && isConfigurable(object.__proto__, key)) {
            Patcher.instead(object.__proto__, key, () => Promise.resolve());
         } else if (object[key] && isConfigurable(object, key)) {
            Patcher.instead(object, key, () => Promise.resolve());
         }
      }
   }
};

function isConfigurable(object, key) {
   const descriptor = Object.getOwnPropertyDescriptor(object, key);
   if (!descriptor.configurable) return false;
   return true;
}