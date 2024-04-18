const Snoway = require("../../structures/client/index");
const Discord = require('discord.js')

module.exports = {
    name: "messageDelete",
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        if (!message.guild || message.bot || !message.author || !message.author.id) return;
        const channelId = message.channel.id;

        client.SnipeMsg.set(channelId, {
            content: message.content,
            author: message.author.id,
            timestamp: Date.now(),
        })
    }
};
