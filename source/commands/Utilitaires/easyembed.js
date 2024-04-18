const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'easyembed',
    description: {
        fr: "Crée un embed simple",
        en: "Create a simple embed"
    },
    usage: {
        fr: { 
        'easyembed <couleur> <texte>': "Crée un embed simple"
        }, en: {
         'easyembed <color> <text>': "Creates a simple embed"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        if (args.length < 2) {
            return message.channel.send(`👀 ${client.prefix}${await client.lang('essyembed.usage')}`);
        }

        const colorArg = args[0].toLowerCase();
        const textArg = args.slice(1).join(' ');

        if (!client.functions.bot.color(colorArg)) {
            return message.channel.send(await client.lang('essyembed.invalide'));
        }
        const embed = new Discord.EmbedBuilder()
            .setColor(colorArg)
            .setDescription(textArg);

        message.channel.send({embeds: [embed]});
    },
};
