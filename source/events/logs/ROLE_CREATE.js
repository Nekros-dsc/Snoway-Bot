const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, Role } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'roleCreate',
    /**
     * @param {Snoway} client 
     * @param {Role} role 
     */
    run: async (client, role) => {
        const color = await client.db.get(`color_${role.guild.id}`) || client.config.color
        const logs = await client.db.get(`logs_${role.guild.id}`) || []
        const salon = client.channels.cache.get(logs[0]?.roles)
        if (!salon) return;

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 30
        }).then(audit => audit.entries.first());
        const user = fetchedLogs ? fetchedLogs.executor : "Inconnu";


        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Nouveau Rôle')
            .addFields({
                name: "Name", value: `\`\`\`js\n${role.name}\`\`\``, inline: true
            }, {
                name: "Id", value: `\`\`\`js\n${role.id}\`\`\``, inline: true
            }, {
                name: "Couleur", value: `\`\`\`js\n${role.color === 0 ? "Aucune" : role.color}\`\`\``, inline: true
            }, {
                name: "Position", value: `\`\`\`js\n${role.rawPosition}\`\`\``, inline: true
            }, {
                name: "Mentionable", value: `\`\`\`js\n${role.mentionable ? "Oui" : "Non"}\`\`\``, inline: true
            }, {
                name: "Auteur", value: `\`\`\`js\n${user.tag} (ID: ${user.id})\`\`\``, inline: true
            })

        salon.send({
            embeds: [embed]
        })
    }
};
