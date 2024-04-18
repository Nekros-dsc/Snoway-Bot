const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: "renew",
    aliases: ["purge"],
    description: {
        fr: "Permet de récréer un salon",
        en: "Allows you to recreate a living room"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Discord.Message} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(message.channel.id);
        if (!channel) {
            return message.reply("Veuillez mentionner un salon existant ou fournir l'ID d'un salon à recréer.");
        }

        try {
            const chan = await channel.clone({ reason: `Channel renew par ${message.author.tag}` });
            await channel.delete();
            chan.send("<@" + message.author + '>, Salon renouvelé avec succès.').then((m) => setTimeout(() => m.delete(), 2000)).catch((e) => {})
        } catch (error) {
            console.error(error);
            channel.send('Une erreur viens de se produire.');
        }
    }
}
