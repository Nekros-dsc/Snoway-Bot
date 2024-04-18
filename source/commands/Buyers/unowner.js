const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "unowner",
    description: {
        fr: "Retire un owner",
        en: "Remove an owner from the bot"
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    usage: {
        fr: {
            "unowner <mention/id>": "Retire un owner du bot",
        }, en: {
            "unowner <mention/id>": "Remove an owner from the bot",
        }
    },
    run: async (client, message, args) => {
        if (!client.config.buyers.includes(message.author.id)) return;
        const mention = message.mentions.members.first();
        const member = mention ? mention.user : null || await client.users.fetch(args[0]);
        const ownerId = member.id;
        const owners = await client.db.get('owner') || [];

        if (!mention && !args[0]) {
            return message.channel.send(await client.lang('unowner.nouser'));
        }

        if (!owners.includes(ownerId)) {
            return message.channel.send(await client.lang('unowner.nowoner'));
        }

        await client.functions.api.ownerdel(client.user.id, ownerId).then(async (response) => {
            const ownerIndex = owners.indexOf(ownerId);
            owners.splice(ownerIndex, 1);
            await client.db.set('owner', owners);

            return message.channel.send(`\`${member.username}\` ${await client.lang('unowner.remove')}`);
        }).catch(async (error) => {
            console.error('Erreur:', error);
            message.channel.send(await client.lang('erreur'));
        });
    }
};
