const { MessageActionRow, MessageButton, InteractionCollector, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'warnlist',
    aliases: ["sanction", "sanctions"],
    description: {
        fr: 'Liste des avertissements pour un membre du serveur avec un système de radiomessagerie',
        en: "Lists warnings for a server member with a paging system"},
    run: async (client, message, args) => {
        try {
            let user = message.mentions.users.first();
            let memberId = args[0];

            if (!user && memberId) {
                user = await client.users.fetch(memberId).catch(() => null);
            }

            if (!user) {
                return message.channel.send('> ❌ Erreur : Usage: `warnlist <mention/Id>`');
            }

            const db = await client.db.get(`sanction_${message.guild.id}`) || [];
            const warns = db.filter(entry => entry.userId === user.id);

            if (warns.length === 0) {
                return message.channel.send(`Aucun avertissement trouvé pour <@${user.id}>`);
            }

            const itemsPerPage = 5;
            let page = parseInt(args[1]) || 1;
            const startIndex = (page - 1) * itemsPerPage;
            const pageItems = warns.slice(startIndex, startIndex + itemsPerPage);
            const totalPages = Math.ceil(warns.length / itemsPerPage);

            if (pageItems.length === 0) {
                return message.channel.send(`Aucun avertissement trouvé pour <@${user.id}>`);
            }

            const generateEmbed = (page) => {
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageItems = warns.slice(startIndex, endIndex);
                const date = new Date().toLocaleTimeString('fr-FR', { hour12: false });
                const tiime = new Date().toLocaleDateString().replace(/\//g, '-');
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Avertissements de ${user.tag}`)
                    .setFooter({
                        text: client.footer.text + ` • Total de sanction: ${warns.length}`
                    })
                    .addFields(pageItems.map((item, index) => {
                        const date = new Date(item.date);
                        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} [${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]`;
                        return {
                            name: `Sanction ${startIndex + index + 1}`,
                            value: `\`\`\`js\nID: ${item.code}\nRaison: ${item.reason}\nDate: ${formattedDate}\`\`\``
                        };
                    }));

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev_page')
                            .setLabel('<<<')
                            .setStyle(page === 1 ? 2 : 1)
                            .setDisabled(page === 1),
                        new ButtonBuilder()
                            .setCustomId('page')
                            .setLabel(`${page}/${totalPages}`)
                            .setStyle(2)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next_page')
                            .setLabel('>>>')
                            .setStyle(page === totalPages ? 2 : 1)
                            .setDisabled(page === totalPages)
                    );

                return { embed, row };
            };

            const { embed, row } = generateEmbed(page);
            const msg = await message.channel.send({ embeds: [embed], components: [row] });

            const collector = msg.createMessageComponentCollector();

            collector.on('collect', async interaction => {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                      content: await client.lang('interaction'),
                      flags: 64
                    });
                  }
                if (interaction.customId === 'prev_page' && page > 1) {
                    page--;
                } else if (interaction.customId === 'next_page' && page < totalPages) {
                    page++;
                }

                const { embed, row } = generateEmbed(page);
                await interaction.update({ embeds: [embed], components: [row] });
            });

        } catch (err) {
            console.error('Erreur:', err);
            message.reply("Une erreur vient de se produire...");
        }
    }
};
