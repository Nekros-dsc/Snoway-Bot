const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'banlist',
    description: {
        fr: 'Affiche tous les bans du discord',
        en: "Display all discord banns"
    },
    aliases: ['listban'],
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message
     * @param {string[]} args
     * 
     */
    run: async (client, message, args) => {

        const bans = await message.guild.bans.fetch();
        if (!bans.size) return message.channel.send('Aucun membre banni sur ce serveur.');

        const PAGE_SIZE = 10;
        const pageCount = Math.ceil(bans.size / PAGE_SIZE);
        let currentPage = 1;

        const banList = bans.map((ban) => `${ban.user}`).slice(0, PAGE_SIZE);
        const banListMessage = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Liste des bannissement`)
                    .setDescription(`${banList.join('\n')}`)
                    .setFooter({ text: `Page ${currentPage}/${pageCount} - Total ${bans.size} banni` })
            ]
        });

        const previousButton = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('<<<')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const purgebutton = new ButtonBuilder()
            .setCustomId('purge')
            .setLabel('Purge')
            .setStyle(ButtonStyle.Danger)

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('>>>')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pageCount)
        const navigationRow = new ActionRowBuilder()
            .addComponents(previousButton, purgebutton, nextButton);

        const collector = banListMessage.createMessageComponentCollector({
            time: 30000,
        });

        collector.on('collect', async (interaction) => {
            if(interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "Vous n'êtes pas autorisé à utiliser cette interaction.",
                    flags: 64
                })
            }
            if (interaction.customId === 'purge') {
                const bans = await message.guild.bans.fetch();

                if (bans.size === 0) {
                    const msg = await interaction.reply({
                        content: "Il n'y a aucun membre banni.",
                        allowedMentions: { repliedUser: false }
                    });

                    setTimeout(() => {
                        msg.delete().catch(e => { });
                    }, 3000);

                    return;
                }

                const unbanall = [];

                try {
                    bans.forEach(async (ban) => {
                        const user = ban.user;
                        unbanall.push({ id: user.id });
                        await message.guild.bans.remove(user.id);
                    });

                    await client.db.set(`unbanall_${message.guild.id}`, unbanall);
                    interaction.reply({
                        content: `**${bans.size}** membres ont été débannis avec succès. Utilisez \`${client.prefix}cancelunbanall\` pour annuler.`
                    })
                } catch (error) {
                    console.error(error);
                    interaction.reply("Une erreur viens de se produire !");
                }
            }
            if (interaction.customId === 'previous' && currentPage > 1) {
                currentPage--;
            } else if (interaction.customId === 'next' && currentPage < pageCount) {
                currentPage++;
            } else {
                return;
            }

            const start = (currentPage - 1) * PAGE_SIZE;
            const end = currentPage * PAGE_SIZE;

            const newBanList = bans.map((ban) => `${ban.user}`).slice(start, end);
            const newBanListMessage = {
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle(`Liste des bannissement`)
                        .setDescription(`${newBanList.join('\n')}`)
                        .setFooter({ text: `Page ${currentPage}/${pageCount} - Total ${bans.size} banni` })
                ],
            };

            interaction.update({
                embeds: [newBanListMessage.embeds[0]],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('<<<')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 1),
                            new ButtonBuilder()
                                .setCustomId('purge')
                                .setLabel('Purge')
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('>>>')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === pageCount)
                        )
                ]
            });
        });

        collector.on('end', () => {
            banListMessage.edit({ components: [] });
        });

        await banListMessage.edit({
            components: [navigationRow],
        });
    }

};