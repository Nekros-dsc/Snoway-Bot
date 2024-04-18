const Discord = require('discord.js');
const QuickDB = require('quick.db');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'saveembed',
    description: {
        fr:'Sauvegarde un message par son ID',
        en: "Save a message by its ID"
    },
    usage: {
        fr: {
            "saveembed <nom> <messageId>": "Sauvegarde un message par son ID",
            "saveembed": "Affiche tous les embeds enregistrer"
        }, en: {
            "saveembed <name> <messageId>": "Saves a message by its ID",
            "saveembed": "Displays all saved embeds"
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
        if (args.length === 0) {
            const embedNames = await client.db.get('embeds');
            if (!embedNames || embedNames.length === 0) {
                return message.channel.send(await client.lang('savembed.none'));
            }
            const embedList = embedNames.map(embed => embed.name).join('\n ');
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription(embedList)
                .setTitle(await client.lang('savembed.embed.title'))

            return message.channel.send({ embeds: [embed] });
        }

        const name = args[0];
        const messageId = args[1];
        const existingEmbed = await client.db.get(`embeds.${name}`);
        if (existingEmbed) {
            const response = (await client.lang('savembed.presencedb')).replace("{name}", `\`${name}\``)
            return message.channel.send(response);
        }

        const targetMessage = await message.channel.messages.fetch(messageId)
            .catch(err => null);

        if (!targetMessage || !messageId) {
            return message.channel.send(await client.lang('savembed.nomessage'));
        }

        const embedInfo = targetMessage?.embeds[0] || null;

        if (!embedInfo) {
            return message.channel.send(await client.lang('savembed.noembed'));
        }

        const embed = {
            title: embedInfo.title || null,
            type: embedInfo.type || null,
            description: embedInfo.description || null,
            url: embedInfo.url || null,
            timestamp: embedInfo.timestamp || null,
            color: embedInfo.color || null,
            footer: embedInfo.footer ? {
                text: embedInfo.footer.text || null,
                iconURL: embedInfo.footer.iconURL || null,
            } : null,
            image: embedInfo.image ? {
                url: embedInfo.image.url || null,
                proxyURL: embedInfo.image.proxyURL || null,
                height: embedInfo.image.height || null,
                width: embedInfo.image.width || null,
            } : null,
            thumbnail: embedInfo.thumbnail ? {
                url: embedInfo.thumbnail.url || null,
                proxyURL: embedInfo.thumbnail.proxyURL || null,
                height: embedInfo.thumbnail.height || null,
                width: embedInfo.thumbnail.width || null,
            } : null,
            video: embedInfo.video ? {
                url: embedInfo.video.url || null,
                proxyURL: embedInfo.video.proxyURL || null,
                height: embedInfo.video.height || null,
                width: embedInfo.video.width || null,
            } : null,
            author: embedInfo.author ? {
                name: embedInfo.author.name || null,
                url: embedInfo.author.url || null,
                iconURL: embedInfo.author.iconURL || null,
            } : null,
            provider: embedInfo.provider ? {
                name: embedInfo.provider.name || null,
                url: embedInfo.provider.url || null,
            } : null,
            fields: embedInfo.fields || [],
        };

        client.db.push(`embeds`, {
            name: name,
            ...embed,
        });

        message.channel.send(`${await client.lang('savembed.save')} \`${name}\``);
    },
};
