const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'guildCreate',
    /**
     * @param {Snoway} client 
     * @param {Guild} guild 
     */
    run: async (client, guild) => {
        const array = Array.from(guild.members.cache.values());
        const invite = await guild.channels.cache.find(ch => ch.type === 0)?.createInvite({
            maxAge: 0,
            maxUses: 0,
        });

        const proprios = await client.users.fetch(guild.ownerId)
        const ownerbot = [
            ...(await client.db.get(`owner`)) || [],
            ...(client.config.buyers || [])
        ];
        const owner = array.some(membres => ownerbot.includes(membres.user.id));
        if (!owner) {
            const embeds = new EmbedBuilder()
                .setColor("FF4040")
                .setTimestamp()
                .setFooter(client.footer)
                .setDescription(`J'ai quitté le serveur **${guild.name}** car aucun propriétaire n'est présent.`);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(5)
                        .setURL(invite.url)
                        .setLabel("Join " + guild.name)
                )

            const messageLeave = ownerbot.map(ownerID => {
                const ownerUser = client.users.cache.get(ownerID);
                if (ownerUser) {
                    return ownerUser.send({ embeds: [embeds], components: [row] }).catch(() => { });
                }
                return Promise.resolve()
            });

            Promise.all(messageLeave)
                .catch(() => { });
            guild.leave()
            return;
        } else {

            const embed = new EmbedBuilder()
                .setColor("#1bff09")
                .setFooter(client.footer)
                .setTimestamp()
                .setDescription(`J'ai rejoint le serveur **${guild.name}**\nPropriétaire : \`${proprios.username} (${proprios.id}\`\nMembres : **${guild.memberCount.toLocaleString()}**`)
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(5)
                        .setURL(invite.url)
                        .setLabel("Join " + guild.name)
                )
            const messagejoins = ownerbot.map(ownerID => {
                const ownerUser = client.users.cache.get(ownerID);
                if (ownerUser) {
                    return ownerUser.send({ embeds: [embed], components: [row] }).catch(() => { });
                }
                return Promise.resolve();
            });

            Promise.all(messagejoins)
                .catch(() => { });
        }


    }
};
