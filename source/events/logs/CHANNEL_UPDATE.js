const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelUpdate',
    run: async (client, oldChannel, newChannel) => {
        const color = await client.db.get(`color_${newChannel.guild.id}`) || client.config.color;
        const logs = await client.db.get(`logs_${newChannel.guild.id}`) || [];
        const channelId = logs.find(obj => obj.hasOwnProperty('channel'));
        const salon = client.channels.cache.get(channelId?.channel);
        if (!salon) return;

        let channeltype = null;
        switch (newChannel.type) {
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

        const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 11
        }).then(audit => audit.entries.first());
        const user = fetchedLogs ? fetchedLogs.executor : "Inconnu";


        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Modification d\'un channel')
            .addFields({ name: "Nom (Avant)", value: `\`\`\`js\n${oldChannel.name}\`\`\``, inline: true })
            .addFields({ name: "Nom (Après)", value: `\`\`\`js\n${newChannel.name}\`\`\``,  inline: true })
            .addFields({ name: "ID", value: `\`\`\`js\n${newChannel.id}\`\`\``, inline: true })
            .addFields({ name: "Type",value:   `\`\`\`js\n${channeltype}\`\`\``, inline: true })
            .addFields({ name: "Auteur", value: `\`\`\`js\n${user.tag} (ID: ${user.id})\`\`\``, inline: true } )

        salon.send({ embeds: [embed] });
    }
};
