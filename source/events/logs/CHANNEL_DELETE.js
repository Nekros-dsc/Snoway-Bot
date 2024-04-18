const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    run: async (client, channel) => {
        const color = await client.db.get(`color_${channel.guild.id}`) || client.config.color;
        const logs = await client.db.get(`logs_${channel.guild.id}`) || [];
        const channelId = logs.find(obj => obj.hasOwnProperty('channel'));
        const salon = client.channels.cache.get(channelId?.channel);
        if (!salon) return;

        let channeltype = null;
        switch (channel.type) {
            case 0:
                channeltype = "Textuel";
                break;
            case 2:
                channeltype = "Vocal";
                break;
            case 4:
                channeltype = "Catégorie";
                break;
            case 5:
                channeltype = "Annonce";
                break;
            case 10:
                channeltype = "Discussion d'annonce";
                break;
            case 11:
                channeltype = "Discussion publique";
                break;
            case 12:
                channeltype = "Discussion privée";
                break;
        }

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 12
        }).then(audit => audit.entries.first());
        const user = fetchedLogs ? fetchedLogs.executor : "Inconnu";

        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Suppression de channel')
            .addFields({ name: "Nom", value: `\`\`\`js\n${channel.name}\`\`\``, inline: true })
            .addFields({ name: "ID", value: `\`\`\`js\n${channel.id}\`\`\``, inline: true })
            .addFields({ name: "Type", value: `\`\`\`js\n${channeltype}\`\`\``, inline: true })
            .addFields({ name: "Auteur", value: `\`\`\`js\n${user.tag} (ID: ${user.id})\`\`\``, inline: true } )
        salon.send({ embeds: [embed] });
    }
};
