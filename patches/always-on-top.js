export default {
   displayName: 'Always On Top',
   id: 'always-on-top',
   executor: async () => {
      DiscordUtilities.IPC.send('DISCORD_UTILITIES_ALWAYS_ON_TOP', true);

      return () => DiscordUtilities.IPC.send('DISCORD_UTILITIES_ALWAYS_ON_TOP', false);
   }
};