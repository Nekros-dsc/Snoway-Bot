const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')

module.exports = {
    name: 'cry',
    description: {
     fr: "Envoie une image d'un personnage en pleure",
     en: "Send an image of a character crying",
    },
    usage: {
        fr: {'cry <@user/id>': 'Envoie une image d\'un personnage en pleure'},
        en: {'cry <@user/id>': 'Send an image of a crying character'}
    },
    /**
* 
* @param {Snoway} client 
* @param {Discord.Message} message 
* @param {string[]} args 
*/
    run: async (client, message, args) => {
        const targetUser = message.mentions.users.first() || client.users.cache.get(args[0]);
        const imageLink = await client.functions.bot.getImageAnime("cry")
        if (targetUser) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`**${message.author.username}** pleure pour <@${targetUser.id}> :crying_cat_face:`)
                .setImage(imageLink)
                .setColor(client.color);

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('Utilisation incorrecte. Mentionnez un utilisateur ou fournissez son ID.');
        }
    },
};