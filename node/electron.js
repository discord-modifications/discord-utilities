const ipcRenderer = DiscordUtilities.executeJS(`Object.keys(require("electron").ipcRenderer)`).slice(3).reduce((newElectron, key) => {
   newElectron[key] = DiscordUtilities.executeJS(`require("electron").ipcRenderer[${JSON.stringify(key)}].bind(require("electron").ipcRenderer)`);

   return newElectron;
}, {});

const shell = DiscordUtilities.executeJS(`require("electron").shell`);
const clipboard = DiscordUtilities.executeJS(`require("electron").clipboard`);
const contextBridge = {
   exposeInMainWorld(name, value) {
      window[name] = value;
   }
};

export { ipcRenderer, shell, contextBridge, clipboard };
export default { ipcRenderer, shell, contextBridge, clipboard };