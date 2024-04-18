const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const Discord = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
module.exports = {
    name: "interactionCreate",
    /**
     * @param {Snoway} client
     * @param {Snoway} interaction
     */
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;

        const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
        const dbserveur = await client?.db.get(`ticket_${interaction.guild.id}`)
        const buttonId = interaction.customId;
        const userId = interaction.user.id;


        if (buttonId.startsWith('claim_')) {
            const ticketId = buttonId.split('_')[1];
            const tickets = await client.db.get(`ticket_user_${interaction.guild.id}`);
            const resul = tickets.find(ticket => ticket.id === ticketId);
            if (resul?.author === userId) {
                return interaction.reply({ content: 'Vous ne pouvez pas claim votre propre ticket !', flags: 64 })
            }
            resul.claim = userId;
            const ticketupdate = tickets.map(ticket => (ticket.id === ticketId ? resul : ticket));
            await client.db.set(`ticket_user_${interaction.guild.id}`, ticketupdate);
            const button = new ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('close_' + resul.id)
                    .setLabel('Fermer le ticket')
                    .setStyle(4)
                    .setEmoji('🔒'),
                new Discord.ButtonBuilder()
                    .setLabel('Claim par ' + interaction?.user.username)
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji('🔐')
                    .setCustomId("claim_" + resul.id)
            )
            return interaction.update({
                components: [button]
            })

        }


        if (buttonId.startsWith('close_')) {
            const ticketId = buttonId.split('_')[1];
            const tickets = await client.db.get(`ticket_user_${interaction.guild.id}`);
            const resul = tickets.find(ticket => ticket.id === ticketId);
            if (!resul) return;
            const user = client.users.fetch(resul.author);
            const usercache = client.users.cache.get(resul.author);
            if (!dbserveur) return;
            const dboption = dbserveur.option.find(option => option.value === resul.option);
            const channel = interaction.guild.channels.cache.get(dboption.logs);
            const channelticket = interaction.guild.channels.cache.get(interaction.channel.id);
            const attachment = await discordTranscripts.createTranscript(channelticket);
            if (channel) {
                const embed = new Discord.EmbedBuilder().setColor(color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + interaction.user.username)

                channel.send({
                    files: [attachment],
                    embeds: [embed]
                }).catch(() => { })
            }
            if (dbserveur.transcript) {
                if (usercache) {
                    usercache.send({
                        content: `Votre ticket sur le serveur ${interaction.guild.name} à été fermé\nVoici un transcript du ticket`,
                        files: [attachment],
                    }).catch(() => { })
                }
            }

    
            const salonlog = client.channels.cache.get(dboption.logs)

            if (salonlog) {
                if (dboption.transcript) {
                    const embed = new Discord.EmbedBuilder().setColor(color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + interaction.user.username)
                    salonlog.send({
                        embeds: [embed],
                        files: [attachment],
                    })
                } else {
                    const embed = new Discord.EmbedBuilder().setColor(color).setFooter(client.footer).setAuthor({ name: (await user).username + ' ' + (await user).id, iconURL: (await user).avatarURL() }).setTimestamp().setTitle('Ticket Fermé par ' + interaction.user.username)
                    salonlog.send({
                        embeds: [embed],
                    })
                }
            }
            const ticketupdate = tickets.filter(ticket => ticket.id !== ticketId);
            await client.db.set(`ticket_user_${interaction.guild.id}`, ticketupdate);
            await channelticket.delete();
        }

    }
}