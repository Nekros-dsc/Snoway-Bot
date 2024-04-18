const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: {
        fr: 'Déverrouille le channel en rétablissant les permissions',
        en: 'Unlocks the channel by restoring permissions'
    }, 
    usage: {
        fr: {
            "unlock [salon]": "Permet de débloquer un salon, après ça les membres pourront à nouveau envoyer de messages"
        }, en: {
            "unlock [channel]": "Unblocks a lounge, after which members can send messages again"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message
     * @param {string[]} args
     * 
     */
    run: async (client, message, args) => {
        const targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        try {
            await targetChannel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: null, 
            });

            message.channel.send({ content: `Les membres peuvent à nouveau parler dans ${targetChannel}` });

        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
