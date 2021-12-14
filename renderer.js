// @ts-nocheck

if (typeof (Array.prototype.at) !== 'function') {
   Array.prototype.at = function (index) {
      return index < 0 ? this[this.length - Math.abs(index)] : this[index];
   };
}

if (typeof (setImmediate) === 'undefined') {
   window.setImmediate = (callback) => setTimeout(callback, 0);
}

export class Filters {
   static byProps(...props) {
      return (module) => props.every(prop => prop in module);
   }

   static byDisplayName(name, def = false) {
      return (module) => (def ? (module = module.default) : module) && typeof (module) === 'function' && module.displayName === name;
   }

   static byTypeString(...strings) {
      return (module) => module.type && (module = module.type?.toString()) && strings.every(str => module.indexOf(str) > -1);
   }
}

export default new class Webpack {
   cache = null;
   get Filters() { return Filters; }
   get chunkName() { return 'webpackChunkdiscord_app'; }
   get id() { return 'kernel-req' + Math.random().toString().slice(2, 5); }

   constructor() {
      this.whenReady = this.waitForGlobal.then(() => new Promise(async onReady => {
         const [Dispatcher, { ActionTypes } = {}] = await this.findByProps(
            ['dirtyDispatch'], ['API_HOST', 'ActionTypes'],
            { cache: false, bulk: true, wait: true, forever: true }
         );

         const listener = function () {
            Dispatcher.unsubscribe(ActionTypes.START_SESSION, listener);
            onReady();
         };

         Dispatcher.subscribe(ActionTypes.START_SESSION, listener);
      }));

      window.Webpack = this;
   }

   async waitFor(filter, { retries = 100, all = false, forever = false, delay = 50 } = {}) {
      for (let i = 0; (i < retries) || forever; i++) {
         const module = this.findModule(filter, { all, cache: false });
         if (module) return module;
         await new Promise(res => setTimeout(res, delay));
      }
   }

   parseOptions(args, filter = thing => (typeof (thing) === 'object' && thing != null && !Array.isArray(thing))) {
      return [args, filter(args.at(-1)) ? args.pop() : {}];
   }

   request(cache = true) {
      if (cache && this.cache) return this.cache;
      let req = undefined;

      if (Array.isArray(window[this.chunkName])) {
         const chunk = [[this.id], {}, __webpack_require__ => req = __webpack_require__];
         webpackChunkdiscord_app.push(chunk);
         webpackChunkdiscord_app.splice(webpackChunkdiscord_app.indexOf(chunk), 1);
      }

      if (!req) console.warn('[Webpack] Got empty cache.');
      if (cache) this.cache = req;

      return req;
   }

   findModule(filter, { all = false, cache = true, force = false } = {}) {
      if (typeof (filter) !== 'function') return void 0;

      const __webpack_require__ = this.request(cache);
      const found = [];

      if (!__webpack_require__) return;

      const wrapFilter = function (module, index) {
         try { return filter(module, index); }
         catch { return false; }
      };

      for (const id in __webpack_require__.c) {
         const module = __webpack_require__.c[id].exports;
         if (!module || module === window) continue;

         switch (typeof module) {
            case 'object': {
               if (wrapFilter(module, id)) {
                  if (!all) return module;
                  found.push(module);
               }

               if (module.__esModule && module.default != null && wrapFilter(module.default, id)) {
                  if (!all) return module.default;
                  found.push(module.default);
               }

               if (force && module.__esModule) for (const key in module) {
                  if (!module[key]) continue;

                  if (wrapFilter(module[key], id)) {
                     if (!all) return module[key];
                     found.push(module[key]);
                  }
               }

               break;
            }

            case 'function': {
               if (wrapFilter(module, id)) {
                  if (!all) return module;
                  found.push(module);
               }

               break;
            }
         }
      }

      return all ? found : found[0];
   }

   findModules(filter) { return this.findModule(filter, { all: true }); }

   bulk(...options) {
      const [filters, { wait = false, ...rest }] = this.parseOptions(options);
      const found = new Array(filters.length);
      const searchFunction = wait ? this.waitFor : this.findModule;
      const wrappedFilters = filters.map(filter => (m) => {
         try { return filter(m); }
         catch (error) { return false; }
      });

      const returnValue = searchFunction.call(this, (module) => {
         for (let i = 0; i < wrappedFilters.length; i++) {
            const filter = wrappedFilters[i];
            if (typeof filter !== 'function' || !filter(module) || found[i] != null) continue;

            found[i] = module;

         }

         return found.filter(String).length === filters.length;
      }, rest);

      if (wait) return returnValue.then(() => found);

      return found;
   }

   findByProps(...options) {
      const [props, { bulk = false, wait = false, ...rest }] = this.parseOptions(options);

      if (!bulk && !wait) {
         return this.findModule(Filters.byProps(...props), rest);
      }

      if (wait && !bulk) {
         return this.waitFor(Filters.byProps(...props), rest);
      }

      if (bulk) {
         const filters = props.map((propsArray) => Filters.byProps(...propsArray)).concat({ wait, ...rest });

         return this.bulk(...filters);
      }


      return null;
   }

   findByDisplayName(...options) {
      const [displayNames, { bulk = false, default: defaultExport = false, wait = false, ...rest }] = this.parseOptions(options);

      if (!bulk && !wait) {
         return this.findModule(Filters.byDisplayName(displayNames[0]), rest);
      }

      if (wait && !bulk) {
         return this.waitFor(Filters.byDisplayName(displayNames[0]), rest);
      }

      if (bulk) {
         const filters = displayNames.map(filters.map(Filters.byDisplayName)).concat({ wait, cache });

         return this.bulk(...filters);
      }

      return null;
   }

   findIndex(filter) {
      let foundIndex = -1;

      this.findModule((module, index) => {
         if (filter(module)) foundIndex = index;
      });

      return foundIndex;
   }

   atIndex(index) {
      return this.request(true)?.c[index];
   }

   get waitForGlobal() {
      return new Promise(async onExists => {
         while (!Array.isArray(window[this.chunkName])) {
            await new Promise(setImmediate);
         }

         onExists();
      });
   }

   async wait(callback = null) {
      return this.whenReady.then(() => {
         typeof callback === 'function' && callback();
      });
   }

   get whenExists() { return this.waitForGlobal; }

   on(event, listener) {
      switch (event) {
         case 'LOADED': return this.whenReady.then(listener);
      }
   }

   get once() { return this.on; }
};

const log = (...args) => {
   return console.log('%c[Kernel:DiscordUtilities]', 'color: #5865f2;', ...args);
};

log('Starting package...');
const ipcRenderer = DiscordUtilities.executeJS(`Object.keys(require('electron').ipcRenderer)`).slice(3).reduce((newElectron, key) => {
   newElectron[key] = DiscordUtilities.executeJS(`require('electron').ipcRenderer[${JSON.stringify(key)}].bind(require('electron').ipcRenderer)`);

   return newElectron;
}, {});

log('Attempting to apply minimum size patch...');
try {
   ipcRenderer.send('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', 1, 1);
   log('Successfully applied minimum size patch.');
} catch (e) {
   log('Failed to apply minimum size patch', e);
}

log('Attempting to apply devtools warning patch...');
try {
   ipcRenderer.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING');
   log('Successfully applied devtools warning patch.');
} catch (e) {
   log('Failed to apply devtools warning patch', e);
}

Webpack.whenReady.then(() => {
   log('Attempting to apply persistent token patch...');
   try {
      const Token = Webpack.findByProps('hideToken');
      Token.hideToken = () => void 0;
      log('Successfully applied persistent token patch.');
   } catch (e) {
      log('Failed to apply persistent token patch', e);
   }

   log('Attempting to apply anti-tracking patch...');
   try {
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

      log('Successfully applied anti-tracking patch.');
   } catch (e) {
      log('Failed to apply anti-tracking patch', e);
   }


   log('Attempting to apply F8 fix patch...');

   document.addEventListener('keyup', (event) => {
      if (event.key == 'F8') {
         debugger;
      }
   });

   log('Successfully applied F8 fix patch.');

   log('Attempting to apply experiments patch...');
   try {
      const Experiments = Webpack.findByProps('isDeveloper');
      Object.defineProperty(Experiments, 'isDeveloper', {
         get: () => true
      });

      Experiments._changeCallbacks.forEach(c => c());
      log('Successfully applied experiments patch.');
   } catch (e) {
      log('Failed to apply experiments patch', e);
   }

   log('Patching has completed.');
});