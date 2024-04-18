const Discord = require('discord.js');

module.exports = {
    name: 'add',
    description: {
        fr: "Permet d'ajouter un membre dans un ticket",
        en: "Adds a member to a ticket"
    },
    usage: {
        fr: { 'add <user>': 'Permet d\'ajouter un membre dans un ticket' },
        en: { 'add <user>': 'Adds a member to a ticket' }
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
            await message.channel.permissionOverwrites.edit(
                member,
                {
                    AttachFiles: true,
                    EmbedLinks: true,
                    ReadMessageHistory: true,
                    SendMessages: true,
                    ViewChannel: true,
                },
            )
            message.reply(`${member} a été ajouté au ticket`);
        } catch (error) {
            console.error(error);
            message.reply("Une erreur s'est produite");
        }
    },
};
