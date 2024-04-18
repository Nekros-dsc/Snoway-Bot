const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'snipe',
    aliases: ['sp'],
    description: {
        fr: "Affiche le dernier message supprimé dans le salon",
        en: "Displays the last message deleted in the salon."
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Snoway} args 
     */
    run: async (client, message, args) => {

        const snipe = client.SnipeMsg.get(message.channel.id)

        if(!snipe) {
            return message.channel.send("Il n'y a aucun message à snipe dans ce salon.");
        }
        const user = client.users.cache.get(snipe.author)
        if(!user) {
            user = client.users.fetch(snipe.author)
        }

        const snipeEmbed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer)
        .setAuthor({name: user.discriminator !== 0 ? user.tag : user.username, iconURL: user.avatarURL()})
        .addFields({name: `${snipe.content}`, value: `<t:${Math.floor(snipe.timestamp / 1000)}:R>`})

        return message.channel.send({
            embeds: [snipeEmbed]
        })
    }
}