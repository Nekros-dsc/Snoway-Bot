const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "prevclear",
    description: "Supp les prevnames d'un id",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const id = args[0];
        if (!id) {
            return message.reply('Veuillez spécifier un ID.');
        }
        try {
            const response = await client.api.prevclear(id);
            const count = response.num;
            message.channel.send({ content: `J'ai supprimé \`${count.toString()}\` prevname !` })

        } catch (error) {
            console.error('Erreur:', error);
            message.reply('Une erreur s\'est produite.');
        }
    }
};
