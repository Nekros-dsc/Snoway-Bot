const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')
module.exports = {
  name: 'smile',
  description: {
    fr: "Envoie une image d\'un personnage qui sourit",
    en: "Send a picture of a smiling character"
  },
  usage: {
    fr: {"smile <@user/id>": "Envoie une image d\'un personnage qui sourit"},
    en: {"smile <@user/id>": "Send a picture of a smiling character"},
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {
    const targetUser = message.mentions.users.first() || client.users.cache.get(args[0]);
    const imageLink = await client.functions.bot.getImageAnime("smile")
    if (targetUser) {
      const embed = new Discord.EmbedBuilder()
        .setDescription(`${targetUser}, sourit :smile:`)
        .setImage(imageLink)
        .setColor(client.color);

      message.channel.send({ embeds: [embed] });
    } else {
      message.reply('Utilisation incorrecte. Mentionnez un utilisateur ou fournissez son ID.');
    }

  }
}