const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listmute',
  aliases: ["mutelist"],
  description: {
    fr: 'Liste tous les membres mute sur le serveur',
    en: "List all mute members on the server"
  },
  run: async (client, message, args) => {
    const mutedMembers = message.guild.members.cache.filter((member) => member.communicationDisabledUntilTimestamp !== null);
    
    if (!mutedMembers.size) return message.reply('Aucun membre mute trouvé sur ce serveur.');

    const PAGE_SIZE = 10;
    const pageCount = Math.ceil(mutedMembers.size / PAGE_SIZE);
    let currentPage = 1;
    const msg = await message.reply(`Recherche en cours...`);

    const sendMuteList = async () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const muteList = mutedMembers
        .map((member) => `[\`${member.user.tag}\`](https://discord.com/users/${member.user.id}) (\`${member.user.id}\`) | [\`Fin :\`](${client.support}) <t:${Math.round(parseInt(member.communicationDisabledUntilTimestamp) / 1000)}:R>`)
        .slice(start, end)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`List des mute de ${message.guild.name}`)
        .setDescription(muteList)
        .setColor(client.color)
        .setFooter({ text: `${client.footer.text} | ${currentPage}/${pageCount}` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`avant_${message.id}`)
          .setLabel('<<<')
          .setStyle(currentPage === 1 ? 2 : 1)
          .setDisabled(currentPage === 1),
          new ButtonBuilder()
          .setCustomId(`salope`)
          .setLabel(`${currentPage}/${pageCount}`)
          .setStyle(2)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`suivant_${message.id}`)
          .setLabel('>>>')
          .setStyle(currentPage === pageCount ? 2 : 1)
          .setDisabled(currentPage === pageCount)
      );

      await msg.edit({
        embeds: [embed],
        content: null,
        components: [row],
      });
    };

    await sendMuteList();

    const collector = msg.createMessageComponentCollector();

    collector.on('collect', async (button) => {
        if (button.user.id !== message.author.id) {
          return button.reply({ content: await client.lang('interaction'), ephemeral: true });
        }
        if (button.customId === `avant_${message.id}` && currentPage > 1) {
          currentPage--;
          button.deferUpdate()          
        } else if (button.customId === `suivant_${message.id}` && currentPage < pageCount) {
          currentPage++;
          button.deferUpdate()          
        }
  
  
        await sendMuteList();
      });
  },
};