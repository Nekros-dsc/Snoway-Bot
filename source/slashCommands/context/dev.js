const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "Développeurs Snoway",
    type: "2",
    /**
     * @param {Snoway} client
     * @param {Discord.Integration} interaction
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const targetId = interaction.targetId;
        const user = client.users.cache.get(targetId);
        const isDev = client.dev.includes(targetId);
        return interaction.editReply({
            content: isDev ? `${user.username} est bien un développeur de Snoway.` : `${user.username} n'est pas un développeur de Snoway.`
        });
    }
};
