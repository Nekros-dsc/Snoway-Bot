const Discord = require('discord.js');

module.exports = {
    name: 'giveawayend',
    description: {
        fr: 'Permet de mettre fin à un giveaway en cours',
        en: "Ends a giveway in progress"
    },
    aliases: ["end"], 
    usage: {
       fr: {"gwend <code>": "Termine un giveaway en cours en utilisant son code"},
       en: {"gwend <code>": "Ends a giveway in progress using its code"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.reply("Veuillez spécifier le code du giveaway à terminer.");
        }

        const giveawayData = await client.db.get(`giveaway_${message.guild.id}_${args[0]}`);
        
        if (!giveawayData) {
            return message.reply("Aucun giveaway trouvé avec ce code.");
        }
       
        if (giveawayData.end) {
            return message.reply("Ce giveaway est déjà terminé.");
        }

        giveawayData.endTime = Date.now() + 1000;
        await client.db.set(`giveaway_${message.guild.id}_${args[0]}`, giveawayData);
    },
};
