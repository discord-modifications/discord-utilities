import Webpack from '../modules/webpack.js';

export default {
   displayName: 'No-Track',
   id: 'no-track',
   default: true,
   executor: async () => {
      await Webpack.whenReady;

      const Analytics = Webpack.findByProps('getSuperPropertiesBase64');
      const Reporter = Webpack.findByProps('submitLiveCrashReport');
      const Handlers = Webpack.findByProps('analyticsTrackingStoreMaker');
      const Sentry = {
         main: window.__SENTRY__.hub,
         client: window.__SENTRY__.hub.getClient()
      };

      Analytics.__oldTrack = Analytics.track;
      Analytics.track = () => void 0;

      Handlers.AnalyticsActionHandlers._handleTrack = Handlers.handleTrack;
      Handlers.AnalyticsActionHandlers.handleTrack = () => void 0;

      Reporter.__oldSubmitLiveCrashReport = Reporter.submitLiveCrashReport;
      Reporter.submitLiveCrashReport = () => void 0;

      Sentry.client.close();
      Sentry.main.getStackTop().scope.clear();
      Sentry.main.getScope().clear();
      Sentry.main.__oldAddBreadcrumb = Sentry.main.addBreadcrumb;
      Sentry.main.addBreadcrumb = () => void 0;

      window.__oldConsole = window.console;
      Object.assign(window.console, ['debug', 'info', 'warn', 'error', 'log', 'assert'].forEach(
         (method) => {
            if (window.console[method].__sentry_original__) {
               window.console[method] = window.console[method].__sentry_original__;
            } else if (window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__) {
               window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__ = window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__.__sentry_original__;
            }
         })
      );

      return () => {
         Analytics.track = Analytics.__oldTrack;
         Reporter.submitLiveCrashReport = Reporter.__oldSubmitLiveCrashReport;
         Sentry.main.addBreadcrumb = Sentry.main.__oldAddBreadcrumb;
         Sentry.client.getOptions().enabled = true;
         Handlers.AnalyticsActionHandlers.handleTrack = Handlers.AnalyticsActionHandlers._handleTrack;
         window.console = window.__oldConsole;
      };
   }
};