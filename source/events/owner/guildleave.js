const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'guildDelete',
    /**
     * @param {Snoway} client 
     * @param {Guild} guild 
     */
    run: async (client, guild) => {


        const proprios = await client.users.fetch(guild.ownerId);
        const ownerbot = [
            ...(await client.db.get(`owner`)) || [],
            ...(client.config.buyers || [])
        ];

        const embed = new EmbedBuilder()
            .setColor("#FF4141")
            .setFooter(client.footer)
            .setTimestamp()
            .setDescription(`J'ai quitté le serveur **${guild.name}**\nPropriétaire : \`${proprios.username} (${proprios.id})\`\nMembres : **${guild.memberCount.toLocaleString()}**`);

        ownerbot.map(ownerID => {
            const ownerUser = client.users.cache.get(ownerID);
            if (ownerUser) {
                return ownerUser.send({ embeds: [embed] })
            }
        });


    }
};
