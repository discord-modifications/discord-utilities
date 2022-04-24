import { LoggerModule } from './modules/index.js';
import * as patches from './patches/index.js';

const Logger = LoggerModule.create();
const manifest = DiscordUtilities.manifest;

for (const patch of Object.values(patches)) {
   const mdl = patch.displayName?.toLowerCase() ?? 'Unknown';
   if (!manifest.settings[patch.id]) continue;

   try {
      patch.executor().then(() => Logger.log(`Initialized ${mdl} patch.`));
   } catch (e) {
      Logger.error(`Could not initialize ${mdl}.`, e);
   }
}