module.exports = {
    name: 'hide',
    description: {
        fr: 'Permet de dissimulé un salon',
        en: "Conceals a living room"
    },
    usage: {
        fr: {
            "hide [salon]": "Permet de dissimulé un salon"
        }, en: {
            "hide [channel]": "Conceals a living room"
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
                ViewChannel: false,
            });

            message.channel.send({ content: `> Les membres ne peuvent plus voir le salon ${targetChannel}` });

        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
