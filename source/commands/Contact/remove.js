const Discord = require('discord.js');

module.exports = {
    name: 'remove',
    description: {
        fr: "Retirer un membre au ticket",
        en: "Remove a member from the ticket"
    },
    usage: {
        fr: { 'add <user>': 'Retirer un membre au ticket' },
        en: { 'add <user>': 'Remove a member from the ticket' }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply("Veuillez mentionner un utilisateur à ajouter au channel textuel.");
        }

        const ticketuser = await client.db.get(`ticket_user_${message.guild.id}`) || [];
        const resul = ticketuser.find(ticket => ticket.salon === message.channel.id);
        if (!resul) return message.channel.send({ content: `\`❌\` Erreur : Ce salon n'est pas un de mes ticket` });

        try {
            /** @type {import("discord.js").TextChannel} */
            message.channel.permissionOverwrites.delete(member, `${interaction.user.tag} removed ${member.user.tag} from the ticket`);
            message.reply(`${member} a été retiré du ticket`);
        } catch (error) {
            console.error(error);
            message.reply("Une erreur s'est produite");
        }
    },
};
