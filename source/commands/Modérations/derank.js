const Discord = require('discord.js');

module.exports = {
    name: 'derank',
    description: {
        fr: 'Retire tous les rôles d\'un membre',
        en: 'Remove all roles from a member'
    },
    aliases: ['removeallroles', 'striproles'],
    usage: {
        fr: {
            "derank <@user/ID> [raison]": "Permet de retiré tout les rôles d'un membre"
        }, en: {
            "derank <@user/ID> [raison]": "Remove all roles from a member"
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

        /**
         * @param {Discord.Guild} guild
         */
        const reason = args.slice(1).join(' ') || 'Snoway Derank';
        if (targetMember.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) >= 0) {
            return message.channel.send(`Je n\'ai pas les permissions nécessaires pour derank ${targetMember.user}.`);
          }
        try {
            await targetMember.roles.set([], reason);
            message.channel.send(`${targetMember.user} a été **derank**`);
        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur s\'est produite.');
        }
    }
};
