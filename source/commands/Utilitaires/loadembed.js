const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'loadembed',
    description: {
        fr: 'Charge et affiche un embed sauvegardé par son nom',
        en: "Loads and displays an embed saved by name"
    },
    usage: {
       fr: {"loadembed <nom>": "Charge et affiche un embed sauvegardé par son nom"},
       en: {"loadembed <name>": "Loads and displays an embed saved by name"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const savedEmbeds = await client.db.get(`embeds`);
        
        if (!savedEmbeds || savedEmbeds.length === 0) {
            return message.channel.send(await client.lang('loadembed.noembed'));
        }

        const name = args[0];
        const filteredEmbeds = savedEmbeds.filter(e => e.name === name);

        if (filteredEmbeds.length === 0) {
            return message.channel.send(`${await client.lang('loadembed.noresult')} \`${name}\`.`);
        }

        const embed = new Discord.EmbedBuilder(filteredEmbeds[0]);
        message.channel.send({ embeds: [embed] });
    },
};
