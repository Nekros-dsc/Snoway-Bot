const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'helpall',
    description: {
        fr: 'Affiche toutes les permissions du bot avec les commandes associées.',
        en: 'Displays all bot permissions with associated commands.',
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Array} args
     */
    run: async (client, message, args) => {
        const permissionIndex = await client.db.get(`perms_${message.guild.id}`) || {};
        const permissionsArray = Object.entries(permissionIndex);
        const pageSize = 1;
        const totalPages = Math.ceil(permissionsArray.length / pageSize);

        let currentPage = 1;
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = startIndex + pageSize;
        let fields = [];

        const generateEmbed = (page) => {
            startIndex = (page - 1) * pageSize;
            endIndex = startIndex + pageSize;
            let info = {};

            for (let i = startIndex; i < endIndex && i < permissionsArray.length; i++) {
                const [permission, data] = permissionsArray[i];
                const commands = data.commands && data.commands.length > 0 ? data.commands.join(', ') : "Non configuré";

                info = {
                    perm: permission,
                    role: data.role,
                    cmd: commands,
                    data: data
                };
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
                .setTitle("Helpall - Snoway")
                .addFields(
                    {
                        name: `__${info.perm}__`,
                        value: `${info.perm === "public" ? "@everyone" : (info.role ? `<@&${info.role}>` : "Non configuré")}`
                    },
                    {
                        name: `Commande${info.data?.commands.length !== undefined ? "s" : ""} [${info.data?.commands.length || 0}]`,
                        value: `\`${info.data?.commands.join('\`, \`') || "Aucune"}\``
                    }
                )
                .setFooter(client.footer);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('<<<')
                        .setStyle(1)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('page')
                        .setLabel(`${currentPage}/${totalPages}`)
                        .setStyle(2)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('>>>')
                        .setStyle(1)
                        .setDisabled(page === totalPages)
                );

            return { row, embed };
        };

        const { embed, row } = generateEmbed(currentPage);

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        const collector = sentMessage.createMessageComponentCollector();

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }

            if (interaction.customId === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (interaction.customId === 'next' && currentPage < totalPages) {
                currentPage++;
            }

            const { embed, row } = generateEmbed(currentPage);
            sentMessage.edit({ embeds: [embed], components: [row] });
            interaction.deferUpdate();
        });

        collector.on('end', () => {
            sentMessage.edit({ components: [] });
        });
    },
};
