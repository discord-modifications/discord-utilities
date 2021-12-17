import fs from '../node/fs';
import path from '../node/path';

export default new class Settings {
   constructor() {
      this.file = path.resolve(DiscordUtilities.getBasePath(), 'config.json');

      if (!fs.existsSync(this.file)) {
         fs.writeFile(this.file, {});
      }
   }
};