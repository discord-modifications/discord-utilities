import createLogger from './modules/logger';
import * as patches from './patches/index';

const Logger = createLogger();

for (const patch of Object.values(patches)) {
   const mdl = patch.displayName?.toLowerCase() ?? 'Unknown';
   if (!DiscordUtilities.manifest.settings[patch.id]) continue;

   try {
      patch.executor().then(() => Logger.log(`Initialized ${mdl} patch.`));
   } catch (e) {
      Logger.error(`Could not initialize ${mdl}.`, e);
   }
}