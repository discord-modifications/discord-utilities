export default {
   displayName: 'Remove Minimum Size',
   id: 'remove-minimum-size',
   executor: async () => {
      DiscordUtilities.IPC.send('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', 1, 1);

      return () => DiscordUtilities.IPC.send('DISCORD_UTILITIES_REMOVE_MINIMUM_SIZE', 940, 500);
   }
};