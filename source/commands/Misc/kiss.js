const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')

module.exports = {
    name: 'kiss',
    description: {
      fr: "Envoie une image de deux personnages qui s\'embrassent",
      en: "Send a picture of two people kissing"
    },
    usage: {
        fr: {'kiss <@user/id>': 'Envoie une image de deux personnages qui s\'embrassent'},
        en: {"kiss <@user/id>": "Send a picture of two people kissing"}
    },
    /**
 * 
 * @param {Snoway} client 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
    run: async (client, message, args) => {
        const targetUser = message.mentions.users.first() || client.users.cache.get(args[0]);
        const imageLink = await client.functions.bot.getImageAnime("kiss")
        if (targetUser) {
          const embed = new Discord.EmbedBuilder()
            .setDescription(`**${message.author.username}** fait un bisou à <@${targetUser.id}> :revolving_hearts:`)
            .setImage(imageLink)
            .setColor(client.color);
    
          message.channel.send({ embeds: [embed] });
        } else {
          message.reply('Utilisation incorrecte. Mentionnez un utilisateur ou fournissez son ID.');
        }
    },
};