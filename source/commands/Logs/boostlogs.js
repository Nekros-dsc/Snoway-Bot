const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'boostlogs',
    aliases: ["boostslogs", "logboost", "logsboosts"],
    description: {
        fr: "Permet de définir un channel pour les logs de boost",
        en: "Allows setting a channel for boost logs"
    },
    /**
     *
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.reply("Veuillez mentionner un channel pour les logs boost");
        }
        
        const channelId = args[0].replace(/[<#>|]/g, '');
        
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            return message.reply("Erreur: Channel invalide !");
        }
        
        const logs = await client.db.get(`logs_${message.guild.id}`) || [
            { roles: null },
            { voice: null },
            { message: null },
            { mod: null },
            { raid: null },
            { channel: null },
            { boost: null },
            { flux: null }
        ];
        
        logs.find(obj => obj.hasOwnProperty('boost')).boost = channel.id;
        await client.db.set(`logs_${message.guild.id}`, logs);
        
        return message.reply(`Les logs boost ont été définis sur <#${channel.id}>`);
    },
};
