const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'allbots',
  aliases: ["allbot"],
  description: {
    fr: "Liste tous les bots sur le serveur",
    en: "Lists all bots on the server"
  },
  run: async (client, message, args, commandName) => {

    const botMembers = message.guild.members.cache.filter((member) => member.user.bot);
    if (!botMembers.size) return message.reply('Aucun bot trouvé sur ce serveur.');

    const PAGE_SIZE = 10;
    const pageCount = Math.ceil(botMembers.size / PAGE_SIZE);
    let currentPage = 1;
    const msg = await message.reply(`Recherche en cours...`);

    const sendBotList = async () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const botList = botMembers
        .map((member) => `[\`${member.user.tag}\`](https://discord.com/api/oauth2/authorize?client_id=${member.user.id}&permissions=8&scope=bot%20applications.commands) | (\`${member.user.id}\`)`)
        .slice(start, end)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`Liste des bots`)
        .setDescription(botList)
        .setColor(client.color)
        .setFooter({ text: `Page ${currentPage}/${pageCount}\nTotal: ${botMembers.size}\nServeur: ${message.guild.name}` });


      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`avant`)
          .setLabel('<<<')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 1),
        new ButtonBuilder()
          .setCustomId(`pageee`)
          .setLabel(`${currentPage}/${pageCount}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`suivant`)
          .setLabel('>>>')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === pageCount)
      );

      await msg.edit({
        embeds: [embed],
        content: null,
        components: [row],
      });
    };

    await sendBotList();

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on('collect', async (button) => {
      if (button.user.id !== message.author.id) {
        return button.reply({
          content: await client.lang('interaction'),
          flags: 64
        })
      }
      if (button.customId === `avant` && currentPage > 1) {
        currentPage--;
        button.deferUpdate()

      } else if (button.customId === `suivant` && currentPage < pageCount) {
        currentPage++;
        button.deferUpdate()
      }


      await sendBotList();
    });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  },
};