const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "hideall",
    description: {
        fr: "Permet de caché tous les salons du serveur",
        en: "Allows you to hide all the rooms on the server"
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
                    ViewChannel: false,
                }).then(() => {
                    channelLock++;
                }).catch((error) => {
                    console.error(`Impossible de lock : ${channel.name}:`, error);
                });
            });

            message.channel.send(`${message.guild.channels.cache.size} salons caché.`);

        } catch (error) {
            console.error(error);
            message.channel.send("Une erreur est survenue...");
        }
    }
};