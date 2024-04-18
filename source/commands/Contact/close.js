const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
module.exports = {
    name: 'close',
    description: {
        fr: "Ferme un ticket",
        en: "Close a ticket"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const dbserveur = await client?.db.get(`ticket_${message.guild.id}`)
        const ticketId = message.channel.id
        const tickets = await client.db.get(`ticket_user_${message.guild.id}`);
        const resul = tickets.find(ticket => ticket.salon === ticketId);
        if (!resul) return message.channel.send({ content: `\`❌\` Erreur : Ce salon n'est pas un de mes ticket` });
        const user = client.users.fetch(resul.author).catch(() => client.users.cache.get(resul.author));
        const usercache = client.users.cache.get(resul.author);
        if (!dbserveur) return;
        const dboption = dbserveur.option.find(option => option.value === resul.option);
        const channel = message.guild.channels.cache.get(dboption.logs);
        const channelticket = message.guild.channels.cache.get(message.channel.id);
        const attachment = await discordTranscripts.createTranscript(channelticket);
        if (channel) {
            const embed = new Discord.EmbedBuilder().setColor(client.color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + message.user.username)

            channel.send({
                files: [attachment],
                embeds: [embed]
            }).catch(() => { })
        }
        if (dbserveur.transcript) {
            if (usercache) {
                usercache.send({
                    content: `Votre ticket sur le serveur ${message.guild.name} à été fermé\nVoici un transcript du ticket`,
                    files: [attachment],
                }).catch(() => { })
            }
        }


        const salonlog = client.channels.cache.get(dboption.logs)

        if (salonlog) {
            if (dboption.transcript) {
                const embed = new Discord.EmbedBuilder().setColor(client.color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + message.user.username)
                salonlog.send({
                    embeds: [embed],
                    files: [attachment],
                })
            } else {
                const embed = new Discord.EmbedBuilder().setColor(client.color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + message.user.username)
                salonlog.send({
                    embeds: [embed],
                })
            }
        }
        const ticketupdate = tickets.filter(ticket => ticket.id !== ticketId);
        await client.db.set(`ticket_user_${message.guild.id}`, ticketupdate);
        await channelticket.delete();
    },
};
