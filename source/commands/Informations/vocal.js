const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'vocal',
  aliases: ['vc'],
  description: {
    fr: "Permet d'afficher toutes les statistiques vocales du serveur",
    en: "Displays all server voice statistics"
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @param {Snoway} args 
   */
  run: async (client, message, args) => {
    const membersGuild = await message.guild.members.fetch();
    const memberOnline = membersGuild.filter(member => member.presence && member.presence.status !== 'offline');
    const membersInVoice = membersGuild.filter(member => member.voice.channel);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setFooter(client.footer)
      .setThumbnail(message.guild.iconURL())
      .setTitle(`${message.guild.name} ➔ Statistiques`)
      .setDescription(`Membres: **${membersGuild.size}**\nEn ligne: **${memberOnline.size}**\nEn vocal: **${membersInVoice.size}**\nBoosts: **${message.guild.premiumSubscriptionCount || 0}**`);

    message.channel.send({ embeds: [embed] });
  }
};
