const Snoway = require("../../structures/client/index");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Snoway} client
     * @param {Message} message
     */
    run: async (client, message) => {
        if (message.author.bot || message.content.startsWith(client.prefix) || !message.guild) return;

        const channelIdToCheck = message.channel.id;
        const db = await client.db.get(`stats_message_${message.author.id}_${message.guild.id}`) || {
            last: Date.now(),
            channels: []
        };

        const channelIndex = db.channels.findIndex(channel => channel.channelId === channelIdToCheck);

        if (channelIndex !== -1) {
            db.channels[channelIndex].message += 1;
        } else {
            db.channels.push({
                channelId: channelIdToCheck,
                message: 1
            });
        }
        db.last = Date.now()
        await client.db.set(`stats_message_${message.author.id}_${message.guild.id}`, db);
    }
};
