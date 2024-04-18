const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'banner',
    usage: {
        fr: { 
        "banner [@user/ID]": "Obtenir la bannière d'un utilisateur"
        }, en: {
         "banner [@user/ID]": "Retrieve the banner of a user"
        }
    },
    description: {
        fr: 'Obtenir la bannière d\'un utilisateur',
        en: "Get a user's banner"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!target) {
            return message.channel.send(`Vous devez mentionner un utilisateur ou donner l'identifiant`);
        }
      
        const url = await target.user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
    
        if (!url) {
            return message.channel.send('La bannière de cet utilisateur est introuvable.');
        }
    
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTimestamp()
                .setAuthor({name: `${target.user.username}`, iconURL: target.user.avatarURL({ format: 'png', size: 4096 })})
                .setImage(url)
    
            message.channel.send({ embeds: [embed] });
        },
    };