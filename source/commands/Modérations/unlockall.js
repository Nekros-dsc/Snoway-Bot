const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "unlockall",
    description: {
        fr: "Permet d'ouvrir tous les salons du serveur",
        en: "Opens all server rooms"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args
     * @returns 
     */
    run: async (client, message, args) => {
        let channelUnlock = 0;

        try {
            const channels = message.guild.channels.cache;
            channels.forEach(async (channel) => {
                channelUnlock++;
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: true
                }).catch((error) => {
                    console.error(`Impossible de déverrouiller : ${channel.name}:`, error);
                    channelUnlock--;
                });
            });

            message.channel.send(`${channelUnlock} salons ouverts.`);

        } catch (error) {
            console.error(error);
            message.channel.send("Une erreur est survenue...");
        }
    }
};
