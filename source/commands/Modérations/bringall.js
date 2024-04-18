const Discord = require('discord.js');

module.exports = {
    name: 'bringall',
    description: {
        fr: 'Déplace tous les membres dans un salon vocal spécifié',
        en: "Moves all members to a specified vocal salon"
    },
    usage: {
        fr: {'bringall <salon>': "Permet de déplacer tout les membres en vocal dans un autre"},
        en: {'bringall <salon>': "Moves all members to a specified vocal salon"}
    },
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (message.members.me.permissions.has(Discord.PermissionFlagsBits.MoveMembers)) {
            return message.reply('Je n\'ai pas la permission de déplacer des membres.');
        }


        const targetChannel = message.mentions.channels.first();
        if (!targetChannel || targetChannel.type !== 0) {
            return message.reply('Veuillez mentionner un salon vocal valide.');
        }

        const membersToMove = message.guild.members.cache.filter(member => member.voice.channel);

        membersToMove.forEach(async (member) => {
            try {
                await member.voice.setChannel(targetChannel);
            } catch (error) {
                console.error(`Erreur: ${member.user.tag}:`, error);
            }
        });

        message.reply(`${membersToMove.size} membres déplacés dans ${targetChannel}`);
    },
};
