module.exports = {
    name: 'unhide',
    description: {
        fr: 'Permet d\'exposer un salon',
        en: "Allows you to exhibit a show"
    },
    usage: {
        fr: {
            "hide [salon]": "Permet d'exposer un salon"
        }, en: {
            "hide [channel]": "Allows you to exhibit a show"
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
                ViewChannel: true,
            });

            message.channel.send({ content: `Les membres peuvent de nouveau voir le salon ${targetChannel}` });

        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
