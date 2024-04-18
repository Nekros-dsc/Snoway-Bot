const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {Snoway} = require('../../structures/client/index')
module.exports = {
    name: 'alladmin',
    description: {
        fr: "Liste tous les membres avec la permission d\'administrateur",
        en: "Lists all members with administrator permission"
    },
    /**
     *
     * @param {Snoway} client
     * @param {Message}message
     */
    run: async (client, message) => {

        const adminMembers = message.guild.members.cache.filter((member) => member.permissions.has(PermissionFlagsBits.Administrator));

        if (!adminMembers.size) return message.reply('Aucun membre avec la permission d\'administrateur trouvé sur ce serveur.');

        const PAGE_SIZE = 10;
        const pageCount = Math.ceil(adminMembers.size / PAGE_SIZE);
        let currentPage = 1;
        const msg = await message.reply(`Recherche en cours...`);

        const sendAdminList = async () => {
            const start = (currentPage - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const adminList = adminMembers
                .map((member) => `[\`${member.user.tag}\`](https://discord.com/users/${member.user.id}) | (\`${member.user.id}\`)`)
                .slice(start, end)
                .join('\n');

            const embed = new EmbedBuilder()
                .setTitle(`Liste des administrateurs`)
                .setDescription(adminList)
                .setColor(client.color)
                .setFooter({ text: `Page ${currentPage}/${pageCount}\nTotal: ${adminMembers.size}\nServeur: ${message.guild.name}` });

                const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`avant_${message.id}`)
                    .setLabel('<<<')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                    .setCustomId(`pageee`)
                    .setLabel(`${currentPage}/${pageCount}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`suivant_${message.id}`)
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

        await sendAdminList();

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on('collect', async (button) => {
            if(button.user.id !== message.author.id) {
                return button.reply({
                    content: "Vous n'êtes pas autorisé à utiliser cette interaction.",
                    flags: 64
                })
            }
            if (button.customId === `avant_${message.id}` && currentPage > 1) {
                currentPage--;
                button.deferUpdate()
            } else if (button.customId === `suivant_${message.id}` && currentPage < pageCount) {
                currentPage++;
                button.deferUpdate()
            }


            await sendAdminList();
        });

        collector.on('end', () => {
            msg.edit({ components: [] });
        });
    },
};