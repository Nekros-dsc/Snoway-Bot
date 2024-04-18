const Snoway = require("../../structures/client/index");
const Discord = require('discord.js')

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message, newmessage) => {
        if (!message.guild || message.bot || !message.author || !message.author.id) return;
        if(!message.content === undefined || !newmessage.content === undefined)return;
        const channelId = message.channel.id;

        client.SnipeEdit.set(channelId, {
            origin: message.content,
            new: newmessage.content,
            author: message.author.id,
            timestamp: Date.now(),
        })
    }
};
