const Discord = require('discord.js');

module.exports = {
    name: 'giveawayreroll',
    aliases: ["reroll"],
    description: {
        fr: 'Permet de choisir de nouveaux gagnants pour un giveaway terminé',
        en: "Allows to choose new winners for a ended giveaway"
    },
    usage: {
        fr: { "reroll <code>": "Choisit de nouveaux gagnants pour un giveaway terminé en utilisant son code" },
        en: { "reroll <code>": "Allows to choose new winners for a ended giveaway using its code" }
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
            return message.reply("Veuillez spécifier le code du giveaway.");
        }

        const giveawayData = await client.db.get(`giveaway_${message.guild.id}_${args[0]}`);

        if (!giveawayData) {
            return message.reply("Aucun giveaway trouvé avec ce code.");
        }

        if (!giveawayData.end) {
            return message.reply("Ce giveaway n'est pas encore terminé.");
        }

        giveawayData.endTime = Date.now() + 1000;
        giveawayData.end = false;
        await client.db.set(`giveaway_${message.guild.id}_${args[0]}`, giveawayData);
    },
};
