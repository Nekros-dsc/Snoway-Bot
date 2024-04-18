const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');

module.exports = {
    name: 'uptime',
    description: {
        fr: "Affiche depuis quand le bot est connecté",
        en: "Shows how long the bot has been connected"
    },
    /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @param {Snoway} args 
   * @returns 
   */
    run: async (client, message, args) => {
        const uptime = `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`;
        message.reply({
            content: `${await client.lang('uptime')} ${uptime}`
        })
    },
};
