const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    run: async (client, channel) => {
        const color = await client.db.get(`color_${channel.guild.id}`) || client.config.color;
        const logs = await client.db.get(`logs_${channel.guild.id}`) || [];
        const channelId = logs.find(obj => obj.hasOwnProperty('channel'));
        const salon = client.channels.cache.get(channelId?.channel);
        if (!salon) return;
        let channeltype = null
        switch (channel.type) {
            case 0:
                channeltype = "Textuel"
                break;
            case 2:
                channeltype = "Vocal"
                break;
            case 4:
                channeltype = "Catégorie"
            case 5:
                channeltype = "Announcement"
                break;
            case 15:
                channeltype = "Forum"
                break;
            case 12:
                channeltype = "Private Thread"
                break;
            case 11:
                channeltype = "Public Thread"
                break;
        }

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 10
        }).then(audit => audit.entries.first());
        const user = fetchedLogs ? fetchedLogs.executor : "Inconnu";
        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Création d\'un channel')
            .addFields({ name: "Nom", value: `\`\`\`js\n${channel.name}\`\`\``, inline: true })
            .addFields({ name: "ID", value: `\`\`\`js\n${channel.id}\`\`\``, inline: true })
            .addFields({ name: "Type", value: `\`\`\`js\n${channeltype}\`\`\``, inline: true })
            .addFields({ name: "Créateur", value: `\`\`\`js\n${user.tag} (ID: ${user.id})\`\`\``, inline: true } )

        salon.send({ embeds: [embed] });
    }
};
