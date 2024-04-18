const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'create',
    description: {
        fr: "Permet de copier un emoji pour l\'ajouter au serveur",
        en: "Copy an emoji to add it to the server"
    },
    aliases: ["emoji"],
    usage: {
        fr: {
            "emoji <1-50 émojis>": "Permet de copier un ou plusieurs emoji(s) pour les ajouter au serveur"
        }, en: {
            "emoji <1-50 emojis>": "Allows you to copy one or more emoji(s) to add them to the server"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const emojiRegex = /<a?:[a-zA-Z0-9_]+:(\d+)>/;
        const totalEmojis = args.length;
        let creeemojis = 0;
        for (const rawEmoji of args) {
            const emojiss = rawEmoji.match(emojiRegex);

            if (emojiss) {
                const emojiId = emojiss[1];
                const extension = rawEmoji.startsWith("<a:") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${emojiId + extension}`;

                message.guild.emojis.create({ attachment: url, name: emojiId })
                    .then(async (emoji) => {
                        creeemojis++;
                        if (creeemojis === totalEmojis) {
                            message.channel.send(`${creeemojis} émoji${creeemojis !== 1 ? "s" : ""} ${await client.lang('emoji.create')}${creeemojis !== 1 ? "s" : ""}`);
                        }
                    })
                    .catch(async (error) => {
                        message.channel.send({ content: await client.lang('erreur') });
                    });
            }
        }
    },
};
