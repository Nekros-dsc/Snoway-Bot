const Discord = require('discord.js');
const Snoway = require('../../structures/client/index')
module.exports = {
    name: "boosters",
    aliases: ["booster"],
    description: {
        fr: "Permet de voir tout les boosters présents sur le serveur",
        en: "View all boosters on the server"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const guild = message.guild;
        let desc = "";
        guild.members.cache
            .filter((m) => m.premiumSince)
            .forEach((m) => {
                desc += `${m.user} (\`${m.user.id}\`)\n`
            })

        let boostE = new Discord.EmbedBuilder()
            .setTitle('Liste des boosters')
            .setDescription(desc || "Aucun booster")
            .setColor(client.color)
            .setFooter({
                text: message.guild.premiumSubscriptionCount + " boosts actuel",
                iconURL: message.guild.iconURL()
            })
        message.channel.send({ embeds: [boostE], allowedMentions: { repliedUser: false } });
    }
}