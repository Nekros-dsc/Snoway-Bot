const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');

module.exports = {
    name: 'claim',
    description: {
        fr: "Claim un ticket",
        en: "Claiming a ticket"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const ticketuser = await client.db.get(`ticket_user_${message.guild.id}`) || [];
        const resul = ticketuser.find(ticket => ticket.salon === message.channel.id);
        if (!resul) return message.channel.send({ content: `\`❌\` Erreur : Ce salon n'est pas un de mes ticket` });
        if (resul.author === message.author.id) return message.channel.send({ content: `\`❌\` Erreur : Vous ne pouvez pas claim votre propre ticket` });
        if (resul.claim) return message.channel.send({ content: `\`❌\` Erreur : Le ticket a déjà été réclamé par <@${resul.claim}>` });
        resul.claim = message.author.id;

        await client.db.set(`ticket_user_${message.guild.id}`, ticketuser);
        return message.channel.send({
            content: `Le ticket a été pris en charge par <@${message.author.id}>`
        });
    },
};
