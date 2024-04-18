const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const Discord = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Snoway} client
     * @param {Snoway} interaction
     */
    run: async (client, interaction) => {
        try {
            if (!interaction.isStringSelectMenu()) return;

            if (interaction.customId === 'ticket') {
                const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
                const ticketmessage = await interaction.channel.messages.fetch(interaction.message.id);
                await interaction.deferReply({ ephemeral: true })
                const id = interaction.values[0].split('_')[1];
                const db = await client?.db.get(`ticket_${interaction.guild.id}`);
                if (!db) return interaction.editReply({content: "Impossible de récupère les données !"});

                const option = db.option.find(option => option.value === id);
                if (!option) return interaction.editReply({content: "Impossible de récupère les données !"});

                const options = [];

                db.option.forEach(option => {
                    const emoji = client.emojis.cache.get(option.emoji);

                    options.push({
                        label: option.text,
                        emoji: emoji ? option.emoji : undefined,
                        description: option.description ? option.description : undefined,
                        value: `ticket_${option.value}`
                    });


                });

                if (ticketmessage) {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('ticket')
                                .addOptions(options)
                        );
                    await ticketmessage.edit({ components: [row] });
                }
                
                const tickeruser = await client.db.get(`ticket_user_${interaction.guild.id}`) || [];

                const resul = tickeruser.find(ticket => ticket.author === interaction.user.id);
                if (resul && tickeruser.length >= db?.maxticket) {
                    return await interaction.editReply({ content: await client.lang('ticket.event.maxticket') });
                }

                
                if (interaction.member.roles.cache.some(role => db.rolerequis.includes(role.id))) {
                    return await interaction.editReply({ content: await client.lang('ticket.event.norequisrole') });
                }

                if (interaction.member.roles.cache.some(role => db.roleinterdit.includes(role.id))) {
                    return await interaction.editReply({ content: await client.lang('ticket.event.roleinterdit')});
                }

                let permissionOverwrites = [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user,
                        allow: [
                            Discord.PermissionFlagsBits.SendMessages,
                            Discord.PermissionFlagsBits.ViewChannel,
                            Discord.PermissionFlagsBits.AttachFiles,
                            Discord.PermissionFlagsBits.AddReactions
                        ]
                    }
                ];


                const channel = await interaction.guild.channels.create({
                    parent: client.channels.cache.get(option.categorie) ? option.categorie : null,
                    name: option.text + '-' + interaction.user.username,
                    type: 0,
                    permissionOverwrites: permissionOverwrites,
                });
                await interaction.editReply({ content: `${await client.lang('ticket.event.open')} <#${channel?.id}>` });
                const salonlog = client.channels.cache.get(option.logs)
                if(salonlog) { 
                const embeds = new Discord.EmbedBuilder().setColor(color).setFooter(client.footer).setAuthor({ name: interaction.user.username + ' ' + interaction.user.id, iconURL: interaction.user.avatarURL() }).setTimestamp().setTitle(await client.lang('ticket.event.openticket') + interaction.user.username)
                salonlog.send({
                    embeds: [embeds],
                })
            }
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.footer)
                    .setDescription(option.message || await client.lang('ticket.defautMessage'))
                    .setTitle(await client.lang('ticket.event.openticket') + interaction.user.username)
                    
                const idunique = code(15)
                const mentionedRoles = option.mention ? option.mention.map(role => `<@&${role}>`).join(', ') : '';
                if (db.buttonclose || db.claimbutton) {
                    const buttonRow = new Discord.ActionRowBuilder();
                
                    if (db.buttonclose) {
                        buttonRow.addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('Fermer le ticket')
                                .setStyle(4)
                                .setEmoji('🔒')
                                .setCustomId("close_" + idunique)
                        );
                    }
                
                    if (db.claimbutton) {
                        buttonRow.addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('Récupère le ticket')
                                .setStyle(2)
                                .setEmoji('🔐')
                                .setCustomId("claim_" + idunique)
                        );
                    }
                
                    channel.send({
                        embeds: [embed],
                        content: mentionedRoles, 
                        components: [buttonRow]
                    });
                } else {
                    channel.send({
                        embeds: [embed],
                        content: mentionedRoles, 
                    });
                }

                tickeruser.push({
                    salon: channel.id,
                    author: interaction.user.id,
                    date: Date.now(),
                    id: idunique,
                    option: option.value,
                    claim: null,
                })
                await client.db.set(`ticket_user_${interaction.guild.id}`, tickeruser)
            }
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Une erreur est survenue.', flags: 64 });
        }
    }
};


function code(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}