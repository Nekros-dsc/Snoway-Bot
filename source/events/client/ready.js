const getNow = () => {
  return {
    time: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  };
};
const Snoway = require('../../structures/client/index');
const ligne = require('../../structures/Utils/ligne');
const { mind } = require('gradient-string');

module.exports = {
  name: 'ready',
  /**
* 
* @param {Snoway} client 
* 
*/
  run: async (client) => {
    console.clear()
    const tag = client.user.tag;
    const id = client.user.id;
    const channel = client.channels.cache.size
    const userbot = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()
    console.log(mind(`___________________________________________________________\n`))
    console.log(mind(`[BOT]      : ${tag} (${id}) est connecté à ${getNow().time}`));
    console.log(mind(`[LANGUE]   : ${await client.db.get(`langue`)}`))
    console.log(mind(`[COMMANDS] : ${client.commands.size}`))
    console.log(mind(`[GUILDS]   : ${client.guilds.cache.size}`));
    console.log(mind(`[CHANNELS] : ${channel}`));
    console.log(mind(`[USERS]    : ${userbot}`));
    console.log(mind(`[LIGNES]   : ${ligne.ligne().toLocaleString()}`));
    console.log(mind(`[VERSION]  : ${client.version}`))
    console.log(mind(`___________________________________________________________\n`))
    console.log(mind('Snoway est prêt'));
    console.log(mind(`___________________________________________________________\n`))
    const restartChannelId = await client.db.get(`restartchannel`);
    if (restartChannelId) {
      const channel = client.channels.cache.get(restartChannelId);

      if (channel) {
        await channel.send(`Bot en ligne.`);
        await client.db.delete(`restartchannel`);
      }
    }

  },
};