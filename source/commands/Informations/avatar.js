const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'avatar',
  aliases: ['pic', "pp"],
  description: {
    fr: "Permet de voir la photo de profil d\'un utilisateur",
    en: "View a user's profile picture"
  },
  usage: {
    fr: {
      "pic [mention/id]": "Permet de voir la photo de profil d'un utilisateur"
    }, en: {
      "pic [mention/id]": "View a user's profile photo"
    }
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Snoway} message 
   * @param {Snoway} args 
   */
    run: async (client, message, args) => {
      let target = null;
  
      const mentionedUser = message.mentions.members.first();
      const idMember = message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id);
  
      if (mentionedUser) {
        target = mentionedUser.user;
      } else if (idMember) {
        target = idMember.user;
      } else {
        try {
          target = await client.users.fetch(args[0]);
        } catch (error) {
          console.error('Error:', error);
        }
      }
  
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({name: `${target?.username}`, iconURL: target.avatarURL({ format: 'png', size: 4096, dynamic: true }), url: client.support})
        .setImage(target.avatarURL({ format: 'png', size: 4096, dynamic: true }))
        .setFooter(client.footer);
  
      return message.channel.send({ embeds: [embed] });
    }
  };