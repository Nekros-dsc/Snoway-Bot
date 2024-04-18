const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'pfp',
    aliases: ["showpic"],
    description: {
        fr: 'Permet d\'envoyer automatiquement les avatars ou bannières de membres aléatoires dans un salon',
        en: 'Automatically sends random member avatars or banners to a channel'
    },
    usage: {
        fr: {'pfp <channel/off>': 'Permet d\'envoyer automatiquement les avatars ou bannières de membres aléatoires dans un salon'},
        en: {'pfp <channel/off>': 'Automatically send random member avatars or banners to a channel'}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const channelID = args[0];

        if (channelID.toLowerCase() === 'off') {
            await client.db.delete(`pfp_${message.guild.id}`);
            return message.channel.send(await client.lang('pfp.off'));
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) {
            return message.channel.send(await client.lang('pfp.channel'));
        }

        await client.db.set(`pfp_${message.guild.id}`, channel.id);

        return message.channel.send(`${await client.lang('pfp.set')} <#${channel.id}>.`);
    },
};
