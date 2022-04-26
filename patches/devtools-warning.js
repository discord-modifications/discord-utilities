export default {
   displayName: 'DevTools Warning',
   id: 'devtools-warning',
   executor: async () => {
      DiscordUtilities.IPC.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING');

      return () => DiscordUtilities.IPC.send('DISCORD_UTILITIES_REMOVE_DEVTOOLS_WARNING', false);
   }
};