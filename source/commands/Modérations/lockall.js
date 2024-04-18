const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "lockall",
    description: {
        fr: "Permet de fermé tous les salons du serveur",
        en: "Closes all server rooms"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args
     * @returns 
     */
    run: async (client, message, args) => {
        let channelLock = 0;

        try {
            const channels = message.guild.channels.cache;
            channels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: false
                }).then(() => {
                    channelLock++;
                }).catch((error) => {
                    console.error(`Impossible de lock : ${channel.name}:`, error);
                });
            });

            message.channel.send(`${message.guild.channels.cache.size} salons fermés.`);

        } catch (error) {
            console.error(error);
            message.channel.send("Une erreur est survenue...");
        }
    }
};