import { create } from '../modules/patcher.js';
import Webpack from '../modules/webpack.js';

const Patcher = create('no-track');

export default {
   displayName: 'No-Track',
   id: 'no-track',
   executor: async () => {
      await Webpack.whenReady;

      const [
         Metadata,
         Analytics,
         Properties,
         Reporter
      ] = Webpack.findByProps(
         ['trackWithMetadata'],
         ['AnalyticsActionHandlers'],
         ['encodeProperties', 'track'],
         ['submitLiveCrashReport'],
         { bulk: true }
      );

      const Sentry = {
         main: window.__SENTRY__?.hub,
         client: window.__SENTRY__?.hub?.getClient()
      };

      if (Metadata) {
         Patcher.instead(Metadata, 'trackWithMetadata', () => { });
         Patcher.instead(Metadata, 'trackWithGroupMetadata', () => { });
         Patcher.instead(Metadata, 'trackWithGroupMetadata', () => { });
      }

      if (Analytics) {
         Patcher.instead(Analytics.AnalyticsActionHandlers, 'handleTrack', () => { });
      }

      if (Properties) {
         Patcher.instead(Properties, 'track', () => { });
      }

      if (Reporter) {
         Patcher.instead(Reporter, 'submitLiveCrashReport', () => { });
      }

      if (Sentry.main && Sentry.client) {
         Sentry.client.close();
         Sentry.main.getStackTop().scope.clear();
         Sentry.main.getScope().clear();
         Patcher.instead(Sentry.main, 'addBreadcrumb', () => { });
      }

      return () => {
         Patcher.unpatchAll();

         if (Sentry.main && Sentry.client) {
            Sentry.client.getOptions().enabled = true;
         }
      };
   }
};