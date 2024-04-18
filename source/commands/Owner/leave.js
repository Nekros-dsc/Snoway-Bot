const Snoway = require("../../structures/client");

module.exports = {
    name: 'leave',
    description: {
        fr: "Permet de faire leave le bot d\'un discord ou il est !",
        en: "Allows you to leave the bot from a discord where it is!"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Snoway} message 
     * @param {Snoway} args 
     * @returns 
     */
    run: async (client, message, args) => {

        const guildId = args[0] || message.guild.id;
        const leaveg = client.guilds.cache.get(guildId) ;

        if ( leaveg.id === client.functions.config.private) {
            return message.reply({ content: await client.lang('leave.none') });
        }

        const response = (await client.lang('leave.demande')).replace('{GuildName}', leaveg.name)
        await message.reply({ content: response });

        const filter = response => {
            return response.author.id === message.author.id;
        };

        try {
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });
            const response = collected.first();

            if (response.content.toLowerCase() === 'oui' || response.content.toLowerCase() === 'yes') {
                message.reply({ content: `${await client.lang('leave.good')} **${leaveg.name}**` }).catch(() => {})
                await leaveg.leave();
            } else {
                message.reply({ content: await client.lang('leave.non') });
            }
        } catch (error) {
            console.error(error);
            message.reply({ content: await client.lang('leave.stop') });
        }
    }
};
