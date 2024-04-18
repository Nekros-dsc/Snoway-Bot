const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'channel',
    aliases: ['channelinfos', 'channelinfo'],
    description: {
        fr: "Permet de voir les informations d\'un salon",
        en: "View show information"
    },
    usage: {
        fr: {"channelinfo <salon>": "Permet de voir les informations d'un salon"},
        en: {"channelinfo <channel>": "View show information"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const arg = args[0];
        const channel = message.guild.channels.cache.get(arg) || message.channel;
        let text = ""
        switch (channel.type) {
            case 0:
                text = "Text"
                break;
            case 4:
                text = "Catégorie"
                break;
            case 2:
                text = "Vocal"
                break;
        }
        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setTitle('Information du salon ' + channel.name)
            .setURL(`https://discord.com/channels/${message.guild.id}/${channel.id}`)
            .addFields(
                { name: `Nom`, value: `\`${channel.name}\``, inline: true },
                { name: `ID`, value: `\`${channel.id}\``, inline: true },
                { name: `Type`, value: `\`${text}\``, inline: true },
                { name: `Topic`, value: `\`${channel.topic || "Aucun"}\``, inline: true },
                { name: `Nsfw`, value: `\`${channel.nsfw ? "✅" : "❌"}\``, inline: true },
                { name: `Mode lent`, value: `\`${channel.defaultThreadRateLimitPerUser ? "✅" : "❌"}\``, inline: true }
            )

        return message.reply({
            embeds: [embed]
        })
    }
};
