module.exports = {
    name: 'lock',
    description: {
        fr: 'Verrouille le channel en restreignant les permissions',
        en: 'Locks the channel by restricting permissions'
    },
    usage: {
        fr: {
            "lock [salon]": "Permet de bloquer un salon, après ça les membres ne pourront plus envoyer de messages"
        }, en: {
            "lock [channel]": "Allows you to block a salon, after which members will no longer be able to send messages."
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
                SendMessages: false,
            });

            message.channel.send({ content: `Les membres ne peuvent plus parler dans ${targetChannel}` });

        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
