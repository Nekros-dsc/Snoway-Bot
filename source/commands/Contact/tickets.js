const { EmbedBuilder, Message, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const { sleep } = require('../../structures/Functions/sleep.js')
const ms = require('../../structures/Utils/ms.js')
module.exports = {
    name: 'ticket',
    aliases: ["tickets"],
    description: {
        fr: 'Permet de créer/configure le sytème de ticket.',
        en: "Creates/configures the ticket system."
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const msg = await message.channel.send({ content: await client.lang('ticket.load') })
        async function embedOptions(module) {
            const db = await client?.db.get(`ticket_${message.guild.id}`) || {}
            const selectedOption = db.option.find(option => option.value === module);
            const categorie = client.channels.cache.get(selectedOption.categorie)
            const channlog = client.channels.cache.get(selectedOption.logs)
            const rolesMention = await Promise.all(selectedOption.mention.map(roleId => message.guild.roles.cache.get(roleId)));
            const description = selectedOption.description
            const messageTicket = selectedOption.message || await client.lang('ticket.defautMessage')
            const embed = new EmbedBuilder()
                .setTitle(await client.lang('ticket.command.embedOption.title'))
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: await client.lang('ticket.command.embedOption.field.categorie'), value: `\`\`\`js\n${categorie?.name || await client.lang('ticket.command.embedOption.aucun')}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.emoji'), value: `\`\`\`js\n${selectedOption.emoji || await client.lang('ticket.command.embedOption.aucun')}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.nom'), value: `\`\`\`js\n${selectedOption.text}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.logs'), value: `\`\`\`js\n${channlog?.name || await client.lang('ticket.command.embedOption.aucun')}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.transcript'), value: `\`\`\`js\n${selectedOption.transcript ? "✅" : "❌"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.role'), value: `\`\`\`js\n${rolesMention.map(role => role?.name).join(', ') || await client.lang('ticket.command.embedOption.aucun')}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedOption.field.description'), value: `\`\`\`js\n${description || await client.lang('ticket.command.embedOption.aucun')}\`\`\``, inline: true })
                .addFields(
                    { name: await client.lang('ticket.command.embedOption.field.message'), value: `\`\`\`js\n${messageTicket}\`\`\`` },
                )


            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('configmenu')
                        .setPlaceholder('Snoway')
                        .addOptions([
                            {
                                label: await client.lang('ticket.command.embedOption.select.categorie'),
                                emoji: '📮',
                                value: 'categorie_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.emoji'),
                                emoji: '🌐',
                                value: 'emoji_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.label'),
                                emoji: '✏',
                                value: 'text_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.logs'),
                                emoji: "🏷",
                                value: 'salon_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.transcript'),
                                emoji: "📜",
                                value: 'transcript_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.role'),
                                emoji: '🔔',
                                value: 'role_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.description'),
                                emoji: "🗨",
                                value: 'description_option_' + selectedOption.value
                            }, {
                                label: await client.lang('ticket.command.embedOption.select.message'),
                                emoji: '📋',
                                value: 'ouvert_option_' + selectedOption.value
                            },
                        ])
                );

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('retour')
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.retour),
                    new ButtonBuilder()
                        .setCustomId('options_delete_' + selectedOption.value)
                        .setStyle(4)
                        .setLabel(await client.lang('ticket.command.embedOption.button'))
                )

            return msg.edit({
                components: [row, button],
                embeds: [embed],
                content: null
            })
        }




        async function embedMenu() {
            const db = await client?.db.get(`ticket_${message.guild.id}`) || {
                option: [],
                salon: null,
                messageid: null,
                type: "select",
                Suppauto: true,
                maxticket: 1,
                leaveclose: false,
                claimbutton: true,
                buttonclose: true,
                transcript: false,
                rolerequis: [],
                roleinterdit: [],
            }

            const optionsValue = db.option.map(option => option.text) || []
            const salon = client.channels.cache.get(db.salon) || "Aucun"
            let modules = ''
            switch (db.type) {
                case 'select':
                    modules = "Sélecteur"
                    break;
                case "button":
                    modules = "Boutons"
                    break;
            }
            const rolesRequis = await Promise.all(db.rolerequis.map(roleId => message.guild.roles.cache.get(roleId)));
            const rolesInterdit = await Promise.all(db.roleinterdit.map(roleId => message.guild.roles.cache.get(roleId)));

            const embed = new EmbedBuilder()
                .setTitle(await client.lang('ticket.command.embedMenu.title'))
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: await client.lang('ticket.command.embedMenu.fields.salon'), value: `\`\`\`js\n${salon?.name || "Aucun"} ${db.messageid && salon?.name ? `(Message: ${db.messageid})` : ""}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.type'), value: `\`\`\`js\n${modules}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.max'), value: `\`\`\`js\n${db.maxticket}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.claim'), value: `\`\`\`js\n${db.claimbutton ? "✅" : "❌"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.close'), value: `\`\`\`js\n${db.buttonclose ? "✅" : "❌"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.transcript'), value: `\`\`\`js\n${db.transcript ? "✅" : "❌"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.role'), value: `\`\`\`js\n${rolesRequis.map(role => role?.name).join(', ') || "Aucun"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.roleinterdit'), value: `\`\`\`js\n${rolesInterdit.map(role => role?.name).join(', ') || "Aucun"}\`\`\``, inline: true },
                    { name: await client.lang('ticket.command.embedMenu.fields.closeauto'), value: `\`\`\`js\n${db.leaveclose ? "✅" : "❌"} (Fermeture au leave du membre)\`\`\``, inline: true }
                )

            const optionselect = db.option.map(option => {
                const emojibot = client.emojis.cache.get(option.emoji);

                return {
                    label: option.text,
                    description: option.description || undefined,
                    emoji: emojibot ? option.emoji : undefined,
                    value: "option_" + option.value
                };
            });

            const SelectOptionEdit = new StringSelectMenuBuilder()
                .setCustomId('select_edit_option')
                .setPlaceholder(await client.lang('ticket.command.embedMenu.selectoption.menu'))
                .addOptions({
                    label: await client.lang('ticket.command.embedMenu.selectoption.create'),
                    emoji: client.functions.emoji.new,
                    value: 'new'
                }, {
                    label: await client.lang('ticket.command.embedMenu.selectoption.delete'),
                    emoji: client.functions.emoji.del,
                    value: 'delete'
                });


            const SelectConfig = new StringSelectMenuBuilder()
                .setCustomId('selec_config')
                .setPlaceholder(await client.lang('ticket.command.embedMenu.select.menu'))
                .addOptions([
                    {
                        label: await client.lang('ticket.command.embedMenu.select.salon'),
                        emoji: '🏷',
                        value: 'salon'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.message'),
                        emoji: '🆔',
                        value: 'messageid'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.type'),
                        emoji: '⏺',
                        value: 'type'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.max'),
                        emoji: "♻",
                        value: 'maxticket'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.buttonclaim'),
                        emoji: "🛡",
                        value: 'claim'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.close'),
                        emoji: '🔒',
                        value: 'close'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.transcript'),
                        emoji: "📚",
                        value: 'transcript'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.requis'),
                        emoji: '⚙',
                        value: 'rolerequis'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.interdit'),
                        emoji: '⛔',
                        value: 'roleinterdit'
                    }, {
                        label: await client.lang('ticket.command.embedMenu.select.leave'),
                        emoji: '🔒',
                        value: 'fermetureleave'
                    }
                ])

            if (optionselect.length === 0) {
                optionselect.push({
                    label: 'Snoway Prime',
                    value: 'snowayv3ticketsettings'
                });
            }

            const selectoption = new StringSelectMenuBuilder()
                .setCustomId('select_option')
                .setPlaceholder(await client.lang('ticket.command.embedOption.vosoption'))
                .setDisabled(optionsValue.length <= 0)
                .addOptions(...optionselect);

            const buttonDel = new ButtonBuilder()
                .setCustomId('delete_button')
                .setStyle(2)
                .setEmoji(client.functions.emoji.del)

            const buttonOptions = new ButtonBuilder()
                .setLabel(`${optionsValue.length}/25`)
                .setCustomId('customid_snoway')
                .setDisabled(true)
                .setStyle(2)

            const buttonDelete = new ButtonBuilder()
                .setEmoji(client.functions.emoji.danger)
                .setCustomId('delete_all_data')
                .setStyle(4)

            const buttonActive = new ButtonBuilder()
                .setEmoji(client.functions.emoji.valide)
                .setCustomId("valide")
                .setStyle(3)

            const row1 = new ActionRowBuilder().addComponents(SelectOptionEdit)
            const row2 = new ActionRowBuilder().addComponents(selectoption)
            const row3 = new ActionRowBuilder().addComponents(SelectConfig)
            const row4 = new ActionRowBuilder().addComponents(buttonActive, buttonOptions, buttonDelete, buttonDel)
            await msg.edit({
                content: null,
                embeds: [embed],
                components: [row1, row2, row3, row4]
            });
        }
        embedMenu()

        const collector = msg.createMessageComponentCollector()
        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: await client.lang('interaction'), flags: 64 })

            const db = await client?.db.get(`ticket_${message.guild.id}`) || {
                option: [],
                salon: null,
                messageid: null,
                type: "select",
                Suppauto: true,
                maxticket: 1,
                leaveclose: false,
                claimbutton: true,
                buttonclose: true,
                transcript: false,
                rolerequis: [],
                roleinterdit: [],
            }


            if (i.customId === "valide") {
                await i.deferReply({ ephemeral: true });
                if (!db || !db.option || db.option.length === 0) {
                    return i.editReply({
                        content: await client.lang('ticket.command.valide.option'),
                        flags: 64
                    });
                }
            
                const salon = client.channels.cache.get(db.salon)
                if (!salon) {
                    return i.editReply({
                        content: await client.lang('ticket.command.valide.nochannel'),
                        flags: 64
                    });
                }
                let fetch = null
                if(db.messageid) { 
                    fetch = await salon.messages.fetch(db.messageid).catch(() => null);
                }

                if (fetch) {
                    if (fetch?.author?.id !== client.user.id) {
                        return i.editReply({
                            content: await client.lang('ticket.command.valide.nomessage'),
                            flags: 64
                        });
                    }
                }
            
                const embed = new EmbedBuilder()
                    .setTitle(await client.lang('ticket.command.valide.embeds.title'))
                    .setDescription(await client.lang('ticket.command.valide.embeds.description'))
                    .setColor(client.color)
                    .setFooter(client.footer);
            
                if (db.type === "select") {
                    const options = db.option.map(option => {
                        const emojibot = client.emojis.cache.get(option.emoji);
                        return {
                            label: option.text,
                            emoji: emojibot ? option.emoji : undefined,
                            description: option.description || undefined,
                            value: `ticket_${option.value}`
                        };
                    });
            
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('ticket')
                                .setPlaceholder('Snoway')
                                .addOptions(options)
                        );
            
                        if (fetch?.content || fetch) {
                            if (fetch?.author?.id === client.user.id) {
                                await fetch.edit({ components: [row] })
                            } 
                        } else {
                            const msg = await salon.send({
                                embeds: [embed],
                                components: [row]
                            });
                            db.messageid = msg.id;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                        }
                } else if (db.type === "button") {
                    const buttons = db.option.map((option, index) => {
                        const emoji = client.emojis.cache.get(option.emoji);
                        const buttonBuilder = new ButtonBuilder()
                            .setCustomId(`ticket_${option.value}`)
                            .setLabel(option.text)
                            .setStyle(2);
                
                        if (emoji) {
                            buttonBuilder.setEmoji(emoji);
                        }
                
                        return buttonBuilder;
                    });
                
                    const groupButtons = [];
                    while (buttons.length > 0) {
                        groupButtons.push(buttons.splice(0, 5));
                    }
                
                    const rowButtons = groupButtons.map(group => new ActionRowBuilder().addComponents(...group));
                
                    if (fetch && (fetch.content || fetch)) {
                        if (fetch.author?.id === client.user.id) {
                            await fetch.edit({ components: rowButtons });
                        }
                    } else {
                        const msg = await salon.send({
                            embeds: [embed],
                            components: rowButtons
                        });
                        db.messageid = msg.id;
                        await client.db.set(`ticket_${i.guild.id}`, db);
                    }
                }
                
                await i.editReply({ content: "Panel des tickets actif" });
                return;
            }
            




            if (i.customId === "retour") {
                i.deferUpdate()
                return embedMenu()
            }

            if (i.customId === "delete_button") {
                i.message.delete()
                return;
            }

            if (i.customId === "delete_all_data") {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.deletedata'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('delete_all_data_yes')
                            .setEmoji(client.functions.emoji.valide)
                            .setStyle(3),
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.no)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });
                return;
            }

            if (i.customId.startsWith('options_delete_')) {
                const optionId = i.customId.split('_')[2];
                const index = db.option.findIndex(option => option.value === optionId);
                if (index !== -1) {
                    db.option.splice(index, 1);
                    await client.db.set(`ticket_${i.guild.id}`, db);
                    i.deferUpdate()
                    embedMenu();
                }
                return;
            }

            if (i.customId === "delete_all_data_yes") {
                await client.db.set(`ticket_${message.guild.id}`, {
                    option: [],
                    salon: null,
                    messageid: null,
                    type: "select",
                    Suppauto: true,
                    maxticket: 1,
                    leaveclose: false,
                    claimbutton: true,
                    buttonclose: true,
                    transcript: false,
                    rolerequis: [],
                    roleinterdit: [],
                })
                await sleep(800)
                await i.deferUpdate()
                embedMenu()
                return;
            }

            if (i.values[0] === 'type') {
                const currentType = db.type;
                const newType = currentType === 'button' ? 'select' : 'button';
                db.type = newType;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return embedMenu();
            }

            if (i.values[0] === 'claim') {
                db.claimbutton = !db.claimbutton;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return embedMenu();
            }

            if (i.values[0] === 'close') {
                db.buttonclose = !db.buttonclose;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return embedMenu();
            }

            if (i.values[0] === 'transcript') {
                db.transcript = !db.transcript;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return embedMenu();
            }

            if (i.values[0] === 'fermetureleave') {
                db.leaveclose = !db.leaveclose;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return await embedMenu();
            }


            if (i.values[0] === 'rolerequis') {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.rolerequis'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const roleId = response.first().content.replace(/[<@&>|]/g, '');
                    const role = message.guild.roles.cache.get(roleId);

                    if (role) {
                        const roles = db.rolerequis.includes(role.id);

                        if (roles) {
                            const index = db.rolerequis.indexOf(role.id);
                            if (index !== -1) {
                                db.rolerequis.splice(index, 1);
                                await client.db.set(`ticket_${i.guild.id}`, db);
                            }
                        } else {
                            db.rolerequis.push(role.id);
                            await client.db.set(`ticket_${i.guild.id}`, db);
                        }
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        await channel.send({ content: await client.lang('ticket.command.invaliderole') });
                    }

                    response.first().delete().catch(() => { });
                    embedMenu()
                    return;
                }
            }

            if (i.values[0] === 'roleinterdit') {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.roleinterdit'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const roleId = response.first().content.replace(/[<@&>|]/g, '');
                    const role = message.guild.roles.cache.get(roleId);

                    if (role) {
                        const roles = db.roleinterdit.includes(role.id);

                        if (roles) {
                            const index = db.roleinterdit.indexOf(role.id);
                            if (index !== -1) {
                                db.roleinterdit.splice(index, 1);
                                await client.db.set(`ticket_${i.guild.id}`, db);
                            }
                        } else {
                            db.roleinterdit.push(role.id);
                            await client.db.set(`ticket_${i.guild.id}`, db);
                        }
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        await channel.send({ content: await client.lang('ticket.command.invaliderole') });
                    }

                    response.first().delete().catch(() => { });
                    embedMenu()
                    return;
                }
            }

            if (i.values[0] === 'maxticket') {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.maxticket'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = response => response.author.id === message.author.id;

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const newMaxTickets = parseInt(collected.first().content.trim());

                    if (!isNaN(newMaxTickets) && newMaxTickets > 0) {
                        db.maxticket = newMaxTickets;
                        await client.db.set(`ticket_${i.guild.id}`, db);
                        await collected.first().delete();
                        return embedMenu();
                    } else {
                        const msg = await message.channel.send(await client.lang('ticket.command.nombreinvalide'));
                        await collected.first().delete();
                        embedMenu();
                        setTimeout(() => {
                            msg.delete().catch(() => { })
                        }, 5000)
                        return;
                    }
                } catch (error) {
                    console.error(error);
                    sentMessage.delete();
                    await embedMenu();
                    message.channel.send(await client.lang('ticket.command.temps') + error.message);
                }
            }

            if (i.values[0] === "salon") {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.salon'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000 });

                if (response && response.first()) {
                    const channelId = response.first().content.replace(/[<#>|]/g, '');
                    const channel = client.channels.cache.get(channelId);

                    if (channel) {
                        db.salon = channel.id;
                        await client.db.set(`ticket_${message.guild.id}`, db);
                        embedMenu();
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const salon = await channel.send({ content: await client.lang('ticket.command.saloninvalide') });
                        embedMenu()
                        setTimeout(() => {
                            salon.delete().catch(() => { })
                        }, 8000)

                    }

                    response.first().delete().catch(() => { });
                }

            } else if (i.values[0] === "messageid") {
                const channel = client.channels.cache.get(db.salon)
                if (!channel) {
                    const msg = await i.reply({ content: await client.lang('ticket.command.messagechannel'), flags: 64 });
                    setTimeout(() => {
                        msg.delete().catch(() => { });
                    }, 5000);
                }
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.messageId'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => {
                    const isValidUser = response.author.id === i.user.id;
                    const isValidContent = response.content && response.content.match(/(\d{17,19})/);
                    return isValidUser && isValidContent;
                };

                const response = await i.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });

                if (response && response.first()) {
                    const messageId = response.first().content.match(/(\d{17,19})/)[1];
                    const salon = client.channels.cache.get(db.salon) || message.channel
                    const fetchedMessage = await salon.messages.fetch(messageId).catch(() => null);

                    if (fetchedMessage) {
                        db.messageid = messageId;
                        await client.db.set(`ticket_${message.guild.id}`, db);
                        response.first().delete().catch(() => { });
                        embedMenu();
                    } else {
                        const invalidMessage = await msg.reply({ content: await client.lang('ticket.command.messageinvalide') });
                        setTimeout(() => {
                            invalidMessage.delete().catch(() => { });
                        }, 5000);
                        response.first().delete().catch(() => { });
                        embedMenu();
                    }
                } else {
                    const timeoutMessage = await msg.reply({ content: await client.lang('ticket.command.finit') })
                    setTimeout(() => {
                        timeoutMessage.delete().catch(() => { });
                    }, 5000);
                    response.first().delete().catch(() => { });
                    embedMenu();
                }
            } if (i.values[0] === 'new') {
                if (db.option.length >= 25) {
                    const ireply = await i.reply({ content: await client.lang('ticket.command.maxoption'), flags: 64, embeds: [], components: [] })
                    await sleep("4000")
                    ireply.delete()
                    return;
                } else {
                    db.option.push({
                        categorie: null,
                        emoji: null,
                        text: await client.lang('ticket.option'),
                        value: code(10),
                        description: null,
                        message: null,
                        logs: null,
                        transcript: false,
                        mention: [],
                    })
                    await client.db.set(`ticket_${i.guild.id}`, db)
                }
                i.deferUpdate()
                embedMenu()
            } if (i.values[0] === 'delete') {
                if (db.option.length === 0) {
                    const ireply = await i.reply({ content: await client.lang('ticket.command.aucuneoption'), flags: 64, embeds: [], components: [] })
                    await sleep("4000")
                    ireply.delete()
                    return;
                }

                const optionselect = db.option.map(options => ({
                    label: options.text,
                    description: options.description || undefined,
                    value: "deleteoption_" + options.value
                }));

                const Button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                const selectoption = new StringSelectMenuBuilder()
                    .setCustomId('select_option_delete')
                    .setPlaceholder(await client.lang('ticket.command.selectoptions'))
                    .addOptions(...optionselect);

                const row = new ActionRowBuilder()
                    .addComponents(selectoption)


                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setDescription(await client.lang('ticket.command.deleteoptions'))
                i.update({
                    embeds: [embed],
                    components: [row, Button],
                    content: null
                })
            } else if (i.values[0].startsWith('deleteoption_')) {
                const optionId = i.values[0].split('_')[1];
                const index = db.option.findIndex(option => option.value === optionId);
                if (index !== -1) {
                    db.option.splice(index, 1);
                    await client.db.set(`ticket_${i.guild.id}`, db);
                    i.deferUpdate()
                    return embedMenu();
                }
            } else if (i.values[0].startsWith('option_')) {
                const optionId = i.values[0].split('_')[1];
                i.deferUpdate()
                return embedOptions(optionId)
            }

            /*
            =================================
                        Options Settings 
            =================================
            */

            if (i.values[0].startsWith('role_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.roleoptions'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const roleId = response.first().content.replace(/[<@&>|]/g, '');
                    const role = message.guild.roles.cache.get(roleId);

                    if (role) {
                        const roles = valideoption.mention.includes(role.id);

                        if (roles) {
                            const index = valideoption.mention.indexOf(role.id);
                            if (index !== -1) {
                                valideoption.mention.splice(index, 1);
                                await client.db.set(`ticket_${i.guild.id}`, db);
                            }
                        } else {
                            valideoption.mention.push(role.id);
                            await client.db.set(`ticket_${i.guild.id}`, db);
                        }
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        await channel.send({ content: await client.lang('ticket.command.invaliderole') });
                    }

                    response.first().delete().catch(() => { });
                    embedOptions(id)
                    return;
                }
            }

            if (i.values[0].startsWith('transcript_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);
                valideoption.transcript = !valideoption.transcript;
                await client.db.set(`ticket_${i.guild.id}`, db);
                await i.deferUpdate();
                return embedOptions(id);
            }

            if (i.values[0].startsWith('salon_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(await client.lang('ticket.command.optionticket'))
                    .setFooter(client.footer);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(client.functions.emoji.retour)
                            .setStyle(2)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000 });

                if (response && response.first()) {
                    const channelId = response.first().content.replace(/[<#>|]/g, '');
                    const channel = client.channels.cache.get(channelId);

                    if (channel) {
                        valideoption.logs = channel.id;
                        await client.db.set(`ticket_${message.guild.id}`, db);
                        embedOptions(id)
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const salon = await channel.send({ content: await client.lang('ticket.command.saloninvalide') });
                        embedOptions(id)
                        setTimeout(() => {
                            salon.delete().catch(() => { })
                        }, 8000)

                    }

                    response.first().delete().catch(() => { });
                }

            }

            if (i.values[0].startsWith('emoji_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                if (valideoption) {

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(await client.lang('ticket.command.emojioption'))
                        .setFooter(client.footer);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('retour')
                                .setEmoji(client.functions.emoji.retour)
                                .setStyle(2)
                        );

                    i.update({
                        content: null,
                        embeds: [embed],
                        components: [row]
                    });

                    try {
                        const filter = response => response.author.id === message.author.id;
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const emojiInput = collected.first().content.trim();
                        const emojiId = emojiget(client, emojiInput);
                        if (!valide(client, emojiId) && !valide(client, emojiInput)) {
                            message.channel.send(await client.lang('ticket.command.emojiinvalide'));
                        } else {
                            const emoji = emojiId || emojiInput;
                            valideoption.emoji = emoji;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                            await collected.first().delete();
                        }
                        await embedOptions(id);
                    } catch (error) {
                        console.error(error);
                        await embedOptions(id);
                        message.channel.send(await client.lang('ticket.command.finit'))

                    }
                }
            }

            if (i.values[0].startsWith('text_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                if (valideoption) {

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription("***Veuillez indiquer la text de l'option***")
                        .setFooter(client.footer);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('retour')
                                .setEmoji(client.functions.emoji.retour)
                                .setStyle(2)
                        );

                    i.update({
                        content: null,
                        embeds: [embed],
                        components: [row]
                    });

                    const filter = response => response.author.id === message.author.id;

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const msgcollect = collected.first().content.trim();
                        const text = msgcollect

                        if (!text) {
                            message.channel.send(await client.lang('ticket.command.invalidetext'));
                        } else {
                            if (text.length >= 80) {
                                return message.channel.send(await client.lang('ticket.command.invalidetextcaractre'));
                            }

                            valideoption.text = msgcollect;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                            await collected.first().delete();
                        }
                        await embedOptions(id);
                    } catch (error) {
                        await embedOptions(id);
                        console.error(error);
                        message.channel.send(await client.lang('ticket.command.finit'))
                    }
                }
            }


            if (i.values[0].startsWith('description_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                if (valideoption) {

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(await client.lang('ticket.command.description'))
                        .setFooter(client.footer);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('retour')
                                .setEmoji(client.functions.emoji.retour)
                                .setStyle(2)
                        );

                    i.update({
                        content: null,
                        embeds: [embed],
                        components: [row]
                    });

                    const filter = response => response.author.id === message.author.id;

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const msgcollect = collected.first().content.trim();
                        const text = msgcollect

                        if (!text) {
                            message.channel.send(await client.lang('ticket.command.nodescription'));
                        } else {
                            if (text.length >= 100) {
                                return message.channel.send(await client.lang('ticket.command.invalidedescriptioncaractre'));
                            }

                            valideoption.description = msgcollect;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                            await collected.first().delete();
                        }
                        await embedOptions(id);
                    } catch (error) {
                        await embedOptions(id);
                        console.error(error);
                        message.channel.send(await client.lang('ticket.command.finit'))
                    }
                }
            }

            if (i.values[0].startsWith('ouvert_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                if (valideoption) {

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(await client.lang('ticket.command.textdouvert'))
                        .setFooter(client.footer);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('retour')
                                .setEmoji(client.functions.emoji.retour)
                                .setStyle(2)
                        );

                    i.update({
                        content: null,
                        embeds: [embed],
                        components: [row]
                    });

                    const filter = response => response.author.id === message.author.id;

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const msgcollect = collected.first().content.trim();
                        const text = msgcollect

                        if (!text) {
                            message.channel.send(await client.lang('ticket.command.textdouvertinvalide'));
                        } else {
                            if (text.length >= 200) {
                                return message.channel.send(await client.lang('ticket.command.caracteres'));
                            }

                            valideoption.message = msgcollect;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                            await collected.first().delete();
                        }
                        await embedOptions(id);
                    } catch (error) {
                        await embedOptions(id);
                        console.error(error);
                        message.channel.send(await client.lang('ticket.command.finit'))
                    }
                }
            }

            if (i.values[0].startsWith('categorie_option_')) {
                const id = i.values[0].split('_')[2];
                const valideoption = db.option.find(option => option.value === id);

                if (valideoption) {

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(await client.lang('ticket.command.categorie'))
                        .setFooter(client.footer);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('retour')
                                .setEmoji(client.functions.emoji.retour)
                                .setStyle(2)
                        );

                    i.update({
                        content: null,
                        embeds: [embed],
                        components: [row]
                    });

                    const filter = response => response.author.id === message.author.id;

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const msgcollect = collected.first().content.trim();
                        const channels = await message.guild.channels.cache.get(msgcollect);
                        if (channels.type !== 4) {
                            message.channel.send(await client.lang('ticket.command.invalidecategorie'));
                            await collected.first().delete();
                        } else {
                            valideoption.categorie = msgcollect;
                            await client.db.set(`ticket_${i.guild.id}`, db);
                            await collected.first().delete();

                        }
                        await embedOptions(id);
                    } catch (error) {
                        console.error(error);
                        await embedOptions(id);
                        message.channel.send(await client.lang('ticket.command.finit'))
                    }
                }
            }
        })
    },


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

function emojiget(client, emoji) {
    const regex = /<a?:\w+:(\d+)>/;
    const match = emoji.match(regex);
    return match ? match[1] : null;
}


function valide(client, emoji) {
    return client.emojis.cache.has(emoji);
}
