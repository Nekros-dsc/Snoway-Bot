const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: {
        fr: 'Expulse un membre du serveur',
        en: 'Kick a member from the server'
    },
    usage: {
        fr: {
            "kick <@user/ID> [raison]": "Permet d'expulser un utilisateur du serveur, une raison peut être précisé"
        }, en: {
            "kick <@user/ID> [reason]": "Used to expel a user from the server, a reason can be specified"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message
     * @param {string[]} args
     * 
     */
    run: async (client, message, args) => {
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!targetMember) {
            return message.channel.send('Aucun membres trouvé.');
        }
        if (targetMember.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) >= 0) {
            return message.channel.send(`Je n\'ai pas les permissions nécessaires pour **kick** ${targetMember.user}.`);
        }

        const reason = args.slice(1).join(' ') || 'Snoway kick';

        if (!targetMember) {
            return message.channel.send(`> \`❌\` Erreur : Usage: \`kick @user @reason\``);
        }

        try {
            await targetMember.kick(reason).catch(() => { })
            message.channel.send({ content: `${targetMember.user} a été **kick**` });

        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
