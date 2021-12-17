export default class fs {
   static readFileSync(path, options = "utf8") {
      return DiscordUtilities.executeJS(`require("fs").readFileSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
   }

   static writeFileSync(path, data, options) {
      return DiscordUtilities.executeJS(`require("fs").writeFileSync(${JSON.stringify(path)}, ${JSON.stringify(data)}, ${JSON.stringify(options)})`);
   }

   static writeFile(path, data, options, callback) {
      if (typeof (options) === "function") {
         (callback) = options;
         options = null;
      }

      const ret = { error: null };
      try { this.writeFileSync(path, data, options); }
      catch (error) { ret.error = error; }

      callback(ret.error);
   }

   static readdirSync(path, options) {
      return DiscordUtilities.executeJS(`require("fs").readdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
   }

   static existsSync(path) {
      return DiscordUtilities.executeJS(`require("fs").existsSync(${JSON.stringify(path)});`);
   }

   static mkdirSync(path, options) {
      return DiscordUtilities.executeJS(`require("fs").mkdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
   }

   static statSync(path, options) {
      return DiscordUtilities.executeJS(`
            const stats = require("fs").statSync(${JSON.stringify(path)}, ${JSON.stringify(options)});
            const ret = {
                ...stats,
                isFile: () => stats.isFile(),
                isDirectory: () => stats.isDirectory()
            };
            ret
        `);
   }
}