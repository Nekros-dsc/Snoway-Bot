const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @returns
     */
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;

        if(message.author.id === "1111779326707388596") {
        if(message.content.toLocaleLowerCase().includes('bite')) {
            message.reply('Bite :)')
           }
        }

        if(message.author.id === "1111779326707388596") {
            if(message.content.toLocaleLowerCase().includes('insidegay')) {
                message.reply("c'est réel :)")
            }
        }
    }
}
