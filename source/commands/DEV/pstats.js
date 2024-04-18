const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "pstats",
    description: "Affiche le nombre de prevname",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        try {
            const response = await client.api.prevcount();
            const count = numm(response.count);
            message.channel.send({ content: `\`${count}\` prevnames dans la snoway API !` })

        } catch (error) {
            console.error('Erreur:', error);
            message.reply('Une erreur s\'est produite.');
        }
    }
};

function numm(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
