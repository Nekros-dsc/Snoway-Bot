const Discord = require('discord.js');
const Snoway = require('../../structures/client/index')
const ms = require('../../structures/Utils/ms')

module.exports = {
    name: "panel",
    aliases: ["antiraid", "protect", "protects"],
    description: {
        fr: "Configure la sécurité du serveur",
        en: "Configures server security"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Discord.Interaction} interaction
     */
    run: async (client, message) => {
        let action = false

        const msg = await message.channel.send("** **")

        async function reloadIndependantRole(module, guild) {
            const db = await dbGet(module);
            let roles = [];
            db.wl.role.forEach(roleId => {
                const role = guild.roles.cache.get(roleId);
                if (role) {
                    roles.push({ name: role.name, id: role.id });
                }
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`\`\`js\n${roles.length > 0 ? roles.map(db => `・ ${db.name} (ID: ${db.id})`).join('\n') : "Aucun rôle ne figure dans la liste des indépendants."}\`\`\``)
                .setTitle('・Indépendant Rôle');

            const SelectAdd = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.RoleSelectMenuBuilder()
                        .setDefaultRoles(null)
                        .setPlaceholder("Séléctionnez un ou plusieurs rôle(s)")
                        .setCustomId('bypassrole_add_' + module)
                        .setMaxValues(25)
                        .setDefaultRoles()
                )

            const SelectRemove = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('bypassrole_remove_' + module)
                        .setPlaceholder("Séléctionnez un ou plusieurs rôle(s)")
                        .setMaxValues(roles.length === 0 ? 1 : roles.length)
                        .setDisabled(roles.length === 0 ? true : false)
                        .setOptions(roles.length > 0 ? roles.map(db => ({
                            label: db.name,
                            description: `ID: ${db.id}`,
                            value: db.id,
                            emoji: client.functions.emoji.role
                        }))
                            : [{ label: "Snoway First", value: 'snowayfirstez' }]
                        )


                )

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('retour_' + module)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.retour),
                    new Discord.ButtonBuilder()
                        .setCustomId('nombrebypassrole_' + module)
                        .setStyle(2)
                        .setDisabled(true)
                        .setLabel(`${roles.length}/25`),
                    new Discord.ButtonBuilder()
                        .setCustomId('clearbypassrole_' + module)
                        .setStyle(2)
                        .setDisabled(roles.length < 0 ? true : false)
                        .setEmoji(client.functions.emoji.del)
                )
            msg.edit({ embeds: [embed], components: [SelectAdd, SelectRemove, button] });
        }

        async function reloadIndependantSalon(module) {
            const db = await dbGet(module);
            let salon = [];
            db.salon.forEach(salonID => {
                const salonn = client.channels.cache.get(salonID);
                if (salonn) {
                    salon.push({ name: salonn.name, id: salonn.id });
                }
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`\`\`js\n${salon.length > 0 ? salon.map(db => `・ ${db.name} (ID: ${db.id})`).join('\n') : "Aucun salon ne figure dans la liste des indépendants."}\`\`\``)
                .setTitle('・Indépendant Salon');

            const SelectAdd = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ChannelSelectMenuBuilder()
                        .setDefaultChannels(salon.map(db => db.id))
                        .setChannelTypes(0)
                        .setPlaceholder("Séléctionnez un ou plusieurs salon(s)")
                        .setCustomId('bypasssalon_add_' + module)
                        .setMaxValues(25)
                )

            const SelectRemove = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('bypasssalon_remove_' + module)
                        .setPlaceholder("Séléctionnez un ou plusieurs salon(s)")
                        .setMaxValues(salon.length === 0 ? 1 : salon.length)
                        .setDisabled(salon.length === 0 ? true : false)
                        .setOptions(salon.length > 0 ? salon.map(db => ({
                            label: db.name,
                            description: `ID: ${db.id}`,
                            value: db.id,
                            emoji: client.functions.emoji.channel
                        }))
                            : [{ label: "Snoway First", value: 'snowayfirstez' }]
                        )


                )

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('retour_' + module)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.retour),
                    new Discord.ButtonBuilder()
                        .setCustomId('nombrebypasssalon_' + module)
                        .setStyle(2)
                        .setDisabled(true)
                        .setLabel(`${salon.length}/25`),
                    new Discord.ButtonBuilder()
                        .setCustomId('clearbypasssalon_' + module)
                        .setStyle(2)
                        .setDisabled(salon.length < 0 ? true : false)
                        .setEmoji(client.functions.emoji.del)
                )
            msg.edit({ embeds: [embed], components: [SelectAdd, SelectRemove, button] });
        }


        async function reloadIndependantUser(module) {
            const db = await dbGet(module);
            let users = [];
            db.wl.user.forEach(userId => {
                const user = client.users.cache.get(userId);
                if (user) {
                    users.push({ name: user.username, id: user.id });
                }
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`\`\`js\n${users.length > 0 ? users.map(db => `・ ${db.name} (ID: ${db.id})`).join('\n') : "Aucun utilisateur ne figure dans la liste des indépendants."}\`\`\``)
                .setTitle('・Indépendant User');

            const SelectAdd = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.UserSelectMenuBuilder()
                        .addDefaultUsers(users.map(db => db.id))
                        .setPlaceholder("Séléctionnez un ou plusieurs utilisateur(s)")
                        .setCustomId('bypassuser_add_' + module)
                        .setMaxValues(25)

                )

            const SelectRemove = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('bypassuser_remove_' + module)
                        .setPlaceholder("Séléctionnez un ou plusieurs utilisateur(s)")
                        .setMaxValues(users.length === 0 ? 1 : users.length)
                        .setDisabled(users.length === 0 ? true : false)
                        .setOptions(users.length > 0 ? users.map(db => ({
                            label: db.name,
                            description: `ID: ${db.id}`,
                            value: db.id,
                            emoji: client.functions.emoji.user
                        }))
                            : [{ label: "Snoway First", value: 'snowayfirstez' }]
                        )


                )

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('retour_' + module)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.retour),
                    new Discord.ButtonBuilder()
                        .setCustomId('nombrebypassuser_' + module)
                        .setStyle(2)
                        .setDisabled(true)
                        .setLabel(`${users.length}/25`),
                    new Discord.ButtonBuilder()
                        .setCustomId('clearbypassuser_' + module)
                        .setStyle(2)
                        .setDisabled(users.length < 0 ? true : false)
                        .setEmoji(client.functions.emoji.del)
                )
            msg.edit({ embeds: [embed], components: [SelectAdd, SelectRemove, button] });
        }

        async function panel(module) {
            let dbmodule = module || "AddBot"
            const db = await dbGet(dbmodule);
            let text_autorisation = "";
            let text_sanction = "";
            if (db.wl.wl) {
                text_autorisation += "         ↪ Utilisateur dans la liste blanche\n";
            }

            if (db.wl.buyers) {
                text_autorisation += "         ↪ Utilisateur dans la liste des propriétaires\n";
            }

            if (db.wl.bypass.includes('USER')) {
                text_autorisation += `         ↪ Utilisateur indépendant (${db.wl.user.length})\n`;
            }

            if (db.wl.bypass.includes('ROLE')) {
                text_autorisation += `         ↪ Rôle indépendant (${db.wl.role.length})\n`;

            }


            switch (db.sanction) {
                case "BAN":
                    text_sanction = "・Banissement du membre"
                    break;
                case "KICK":
                    text_sanction = "・Exclusion du membre"
                    break;
                case "MUTE":
                    text_sanction = "・Exclusion temporaire du membre"
                    break;
                default:
                    text_sanction = "・Aucune"
            }
            const db_module_get = await dbGet();
            const SelectModule = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select_module')
                        .addOptions(Object.keys(db_module_get).map(module => ({
                            label: `${client.utils.anitiraid(module)}`,
                            emoji: db_module_get[module].status ? client.functions.emoji.power_on : client.functions.emoji.power_off,
                            default: module === dbmodule ? true : false,
                            value: module
                        })))
                )

            const selectSanction = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`select_sanction_${dbmodule}`)
                        .addOptions({
                            label: "Banissement du membre",
                            value: "BAN",
                            default: db.sanction === "BAN" ? true : false,
                            emoji: db.sanction === "BAN" ? client.functions.emoji.sanction_on : client.functions.emoji.sanction_off
                        }, {
                            label: "Exclusion du membre",
                            value: "KICK",
                            default: db.sanction === "KICK" ? true : false,
                            emoji: db.sanction === "KICK" ? client.functions.emoji.sanction_on : client.functions.emoji.sanction_off
                        }, {
                            label: "Exclusion temporaire du membre",
                            value: "MUTE",
                            default: db.sanction === "MUTE" ? true : false,
                            emoji: db.sanction === "MUTE" ? client.functions.emoji.sanction_on : client.functions.emoji.sanction_off
                        }, {
                            label: "Aucune",
                            value: "NONE",
                            default: db.sanction === "NONE" ? true : false,
                            emoji: db.sanction === "NONE" ? client.functions.emoji.sanction_on : client.functions.emoji.sanction_off
                        })
                )

            const SelectWL = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('wl-config_' + dbmodule)
                        .setMaxValues(4)
                        .setMinValues(0)
                        .setPlaceholder("Choisissez les utilisateurs autorisés.")
                        .addOptions([
                            {
                                label: `Utilisateurs dans la liste des propriétaires (${(await client.db.get('owner') || []).length})`,
                                value: 'buyers',
                                default: db.wl.buyers ? true : false,
                                emoji: db.wl.buyers ? client.functions.emoji.user_on : client.functions.emoji.user_off,
                            }, {
                                label: `Utilisateurs dans la liste blanche (${(await client.db.get(`wl_${message.guildId}`) || []).length})`,
                                value: 'wl',
                                default: db.wl.wl ? true : false,
                                emoji: db.wl.wl ? client.functions.emoji.wl_on : client.functions.emoji.wl_off,
                            }, {
                                label: `Utilisateurs indépendant (${db.wl.user.length})`,
                                value: 'user',
                                default: db.wl.bypass.includes("USER") ? true : false,
                                emoji: db.wl.bypass.includes("USER") ? client.functions.emoji.user_on : client.functions.emoji.user_off,
                            }, {
                                label: `Rôle indépendant (${db.wl.role.length})`,
                                value: 'role',
                                default: db.wl.bypass.includes("ROLE"),
                                emoji: db.wl.bypass.includes("ROLE") ? client.functions.emoji.role_on : client.functions.emoji.role_off,
                            },
                        ])
                );

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields({
                    name: "・Configuration",
                    value: `\`\`\`py\n` +
                        `Module: ${client.utils.anitiraid(dbmodule)}\n` +
                        `Etat: ${db.status ? "✅" : "❌"}\n` +
                        `${dbmodule === "AntiSpam" ? `Temps: ${await convertTime(db.temps)}\n` : ""}` +
                        `${dbmodule === "AntiSpam" ? `Message: ${db.messages}\n` : ""}` +
                        `${db.message ? `Salons ignorés: ${db.salon.length}\n` : ""}` +
                        `Autorisé: ${text_autorisation ? `\n${text_autorisation}` : "❌"}\`\`\``
                }, {
                    name: "・Sanction:",
                    value: `\`\`\`py\n${text_sanction}\`\`\``
                }, {
                    name: "・Logs",
                    value: `\`\`\`py\nStatus: ${db.logs.status ? "✅" : "❌"}${db.logs.status ? `\nSalon: ${client.channels.cache.get(db.logs.channel)?.name || "Inconnue"} (ID: ${client.channels.cache.get(db.logs.channel)?.id || "Inconnue"}) ` : ""}\`\`\``
                })

            const button_power = new Discord.ButtonBuilder()
                .setCustomId('button_power_' + dbmodule)
                .setStyle(2)
                .setLabel('Status')
                .setEmoji(db.status ? client.functions.emoji.status_on : client.functions.emoji.status_off)

            const logs_power = new Discord.ButtonBuilder()
                .setCustomId('logs_power_' + dbmodule)
                .setStyle(2)
                .setEmoji(client.functions.emoji.logs)
                .setLabel('Logs')

            const button = new Discord.ActionRowBuilder().addComponents(button_power, logs_power)

            if (db.logs.status) {
                button.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('logs_channel_' + dbmodule)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.channel)
                        .setLabel('Salon')
                )
            }

            if (db.wl.bypass.includes("USER")) {
                button.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('bypass_user_' + dbmodule)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.user)
                        .setLabel('Indépendant User')
                )
            }

            if (db.wl.bypass.includes("ROLE")) {
                button.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('bypass_role_' + dbmodule)
                        .setStyle(2)
                        .setEmoji(client.functions.emoji.role)
                        .setLabel('Indépendant Rôle')
                )
            }
            const newComponent = new Discord.ActionRowBuilder()

            if (db.message) {
                newComponent.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('salon_ignore_' + dbmodule)
                        .setStyle(2)
                        .setLabel('Salons ignorés')
                        .setEmoji(client.functions.emoji.slash)
                );

                if (dbmodule === "AntiSpam") {
                    newComponent.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('temps_' + dbmodule)
                            .setStyle(2)
                            .setLabel('Intervalle')
                            .setEmoji(client.functions.emoji.temps),
                            new Discord.ButtonBuilder()
                            .setCustomId('messages_' + dbmodule)
                            .setStyle(2)
                            .setLabel('Message')
                            .setEmoji(client.functions.emoji.message)
                    );
                    
                }
            }

            if (db.message) {
                msg.edit({ embeds: [embed], components: [SelectModule, selectSanction, SelectWL, button, newComponent] });
            } else {
                msg.edit({ embeds: [embed], components: [SelectModule, selectSanction, SelectWL, button] });
            }
        }

        panel();

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }

            if (action) {
                return i.reply({
                    embeds: [new Discord.EmbedBuilder().setColor(client.color).setDescription(`${client.functions.emoji.no_white} Désolé, une action est déjà en cours d'exécution !`)],
                    flags: 64
                })
            }

            if (i.customId.startsWith("bypass_role_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                reloadIndependantRole(dbmodule, i.guild)
            }

            if (i.customId.startsWith("salon_ignore_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                reloadIndependantSalon(dbmodule)
            }

            if (i.customId.startsWith("bypass_user_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                reloadIndependantUser(dbmodule)
            }

            if (i.customId.startsWith("retour_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                panel(dbmodule)
            }

            if (i.customId.startsWith("bypasssalon_add_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].salon.length >= 25) {
                    return i.reply({ content: "Vous ne pouvez pas ajouter plus de 25 salons !", flags: 64 });
                }

                for (const salonID of values) {
                    const userNotDb = !db[dbmodule].salon.includes(salonID);
                    if (userNotDb) {
                        db[dbmodule].salon.push(salonID);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantSalon(dbmodule);
            }

            if (i.customId.startsWith("bypasssalon_remove_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].salon.length === 0) {
                    return i.reply({ content: "Aucun salon à retirer de la liste des salon indépendants.", flags: 64 });
                }

                for (const salonID of values) {
                    const salonDB = db[dbmodule].salon.includes(salonID);

                    if (salonDB) {
                        db[dbmodule].salon = db[dbmodule].salon.filter(id => id !== salonID);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantSalon(dbmodule);
            }


            if (i.customId.startsWith("clearbypasssalon_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[1];
                const db = await dbGet();
                db[dbmodule].salon = []
                await client.db.set(`antiraid_${message.guildId}`, db)
                reloadIndependantSalon(dbmodule)
            }

            if (i.customId.startsWith("bypassuser_add_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].wl.user.length >= 25) {
                    return i.reply({ content: "Vous ne pouvez pas ajouter plus de 25 utilisateurs !", flags: 64 });
                }

                for (const userId of values) {
                    const userNotDb = !db[dbmodule].wl.user.includes(userId);
                    if (userNotDb) {
                        db[dbmodule].wl.user.push(userId);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantUser(dbmodule);
            }

            if (i.customId.startsWith("bypassuser_remove_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].wl.user.length === 0) {
                    return i.reply({ content: "Aucun utilisateur à retirer de la liste des users indépendants.", flags: 64 });
                }

                for (const userId of values) {
                    const roleDb = db[dbmodule].wl.user.includes(userId);

                    if (roleDb) {
                        db[dbmodule].wl.user = db[dbmodule].wl.user.filter(id => id !== userId);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantUser(dbmodule);
            }

            if (i.customId.startsWith("clearbypassuser_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[1];
                const db = await dbGet();
                db[dbmodule].wl.user = []
                await client.db.set(`antiraid_${message.guildId}`, db)
                reloadIndependantUser(dbmodule)
            }

            if (i.customId.startsWith("bypassrole_add_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].wl.role.length >= 25) {
                    return i.reply({ content: "Vous ne pouvez pas ajouter plus de 25 rôles !", flags: 64 });
                }

                for (const roleId of values) {
                    const roleNotInDb = !db[dbmodule].wl.role.includes(roleId);

                    if (roleNotInDb) {
                        db[dbmodule].wl.role.push(roleId);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantRole(dbmodule, i.guild);
            }

            if (i.customId.startsWith("bypassrole_remove_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[2];
                const db = await dbGet();
                const values = i.values;

                if (db[dbmodule].wl.role.length === 0) {
                    return i.reply({ content: "Aucun rôle à retirer de la liste des rôles indépendants.", flags: 64 });
                }

                for (const roleId of values) {
                    const roleInDb = db[dbmodule].wl.role.includes(roleId);

                    if (roleInDb) {
                        db[dbmodule].wl.role = db[dbmodule].wl.role.filter(id => id !== roleId);
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                reloadIndependantRole(dbmodule, i.guild);
            }



            if (i.customId.startsWith("clearbypassrole_")) {
                i.deferUpdate();
                const dbmodule = i.customId.split('_')[1];
                const db = await dbGet();
                db[dbmodule].wl.role = []
                await client.db.set(`antiraid_${message.guildId}`, db)
                reloadIndependantRole(dbmodule, i.guild)
            }

            if (i.customId.startsWith("logs_channel_")) {
                const db = await dbGet()
                const dbmodule = i.customId.split('_')[2];
                i.deferUpdate();
                action = true
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("***\`Mentionne\` ou envoie-moi \`l'identifiant\` du salon que tu souhaites ajouter, écrit \`cancel\` pour annuler***")


                const msg_demande = await i.channel.send({
                    content: null,
                    embeds: [embed],
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const channelId = response.first().content.replace(/[<#>|]/g, '');
                    const channel = client.channels.cache.get(channelId);
                    if (response.first().content === "cancel" || response.first().content === "ntm") {
                        panel(dbmodule)
                        action = false
                        response.first().delete().catch(() => { });
                        msg_demande.delete().catch(() => { });
                        return;
                    }
                    if (channel) {
                        db[dbmodule].logs.channel = channel.id;
                        await client.db.set(`antiraid_${message.guildId}`, db)
                        panel(dbmodule)
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const salon = await channel.send({ content: '***Le salon mentionné est invalide. Veuillez mentionner un salon valide.***' });
                        panel(dbmodule)
                        setTimeout(() => {
                            salon.delete().catch(() => { })
                        }, 8000)

                    }

                    action = false
                    response.first().delete().catch(() => { });
                    msg_demande.delete().catch(() => { });
                }
            }


            if (i.customId.startsWith("temps_")) {
                const db = await dbGet()
                const dbmodule = i.customId.split('_')[1];
                i.deferUpdate();
                action = true;
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("***Envoie-moi la \`durée\` que tu souhaite modifier, écrit \`cancel\` pour annuler.***");

                const msg_demande = await i.channel.send({
                    content: null,
                    embeds: [embed],
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const input = response.first().content.trim();

                    if (input.toLowerCase() === "cancel" || input.toLowerCase() === "ntm") {
                        action = false;
                        response.first().delete().catch(() => {});
                        msg_demande.delete().catch(() => {});
                        return;
                    }

                    let duration = ms(input);
                    if (!duration) {
                        action = false;
                        response.first().delete().catch(() => { });
                        msg_demande.delete().catch(() => { });
                        const responseReply = await i.channel.send({
                            embeds: [new Discord.EmbedBuilder().setColor(client.color).setDescription(`Le temps indiqué est **invalide**. Veuillez essayer avec des formats comme : \`15s\`, \`1m\` !`)],
                            flags: 64
                        });

                        setTimeout(() => {
                            responseReply.delete().catch(() => { });
                        }, ms("10s"));
                        return;
                    } else {
                        db[dbmodule].temps = duration
                         await client.db.set(`antiraid_${message.guildId}`, db)
                    }

                    
                    panel(dbmodule);
                    action = false;
                    response.first().delete().catch(() => { });
                    msg_demande.delete().catch(() => { });
                }
            }

            if (i.customId.startsWith("messages_")) {
                const db = await dbGet();
                const dbmodule = i.customId.split('_')[1];
                i.deferUpdate();
                action = true;
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("***Envoie-moi le nombre de \`message maximal\` de l'action, \`cancel\` pour annuler***");
            
                const msg_demande = await i.channel.send({
                    content: null,
                    embeds: [embed],
                });
            
                const filter = (response) => response.author.id === i.user.id && !isNaN(parseInt(response.content));
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });
            
                if (response && response.first()) {
                    const input = parseInt(response.first().content.trim());
            
                    if (isNaN(input)) {
                        action = false;
                        response.first().delete().catch(() => {});
                        msg_demande.delete().catch(() => {});
                        const responseReply = await i.channel.send({
                            embeds: [new Discord.EmbedBuilder().setColor(client.color).setDescription(`Vous n'avez pas indiqué un nombre.`)],
                            flags: 64
                        });
            
                        setTimeout(() => {
                            responseReply.delete().catch(() => {});
                        }, ms("10s"));
                        return;
                    } else {
                        db[dbmodule].messages = input;
                        await client.db.set(`antiraid_${message.guildId}`, db);
                    }
            
                    panel(dbmodule);
                    action = false;
                    response.first().delete().catch(() => {});
                    msg_demande.delete().catch(() => {});
                }
            }
            
            if (i.customId.startsWith("button_power_")) {
                const db = await dbGet()
                const dbmodule = i.customId.split('_')[2];
                db[dbmodule].status = !db[dbmodule].status;
                await client.db.set(`antiraid_${message.guildId}`, db)
                i.deferUpdate();
                panel(dbmodule)
            }

            if (i.customId.startsWith("logs_power_")) {
                const db = await dbGet()
                const dbmodule = i.customId.split('_')[2];
                db[dbmodule].logs.status = !db[dbmodule].logs.status;
                await client.db.set(`antiraid_${message.guildId}`, db)
                i.deferUpdate();
                panel(dbmodule)
            }

            if (i.customId === "select_module") {
                i.deferUpdate();
                panel(i.values[0])
            }

            if (i.customId.startsWith("wl-config_")) {
                const db = await dbGet();
                const dbmodule = i.customId.split('_')[1];

                if (i.values.includes("wl")) {
                    db[dbmodule].wl.wl = true;
                }

                if (!i.values.includes("wl")) {
                    db[dbmodule].wl.wl = false;
                }

                if (i.values.includes("buyers")) {
                    db[dbmodule].wl.buyers = true;
                }

                if (!i.values.includes("buyers")) {
                    db[dbmodule].wl.buyers = false;
                }

                if (!i.values.includes("user")) {
                    const userIndex = db[dbmodule].wl.bypass.indexOf("USER");
                    if (userIndex !== -1) {
                        db[dbmodule].wl.bypass.splice(userIndex, 1);
                    }
                }

                if (i.values.includes("user")) {
                    const userIndex = db[dbmodule].wl.bypass.indexOf("USER");
                    if (userIndex !== -1) { } else {
                        db[dbmodule].wl.bypass.push("USER");
                    }
                }

                if (!i.values.includes("role")) {
                    const roleIndex = db[dbmodule].wl.bypass.indexOf("ROLE");
                    if (roleIndex !== -1) {
                        db[dbmodule].wl.bypass.splice(roleIndex, 1);
                    }
                }

                if (i.values.includes("role")) {
                    const roleIndex = db[dbmodule].wl.bypass.indexOf("ROLE");
                    if (roleIndex !== -1) { } else {
                        db[dbmodule].wl.bypass.push("ROLE");
                    }
                }

                await client.db.set(`antiraid_${message.guildId}`, db);
                i.deferUpdate();
                panel(dbmodule);
            }


            if (i.customId.startsWith('select_sanction_')) {
                const db = await dbGet()
                const sanction = i.values[0]
                const dbmodule = i.customId.split('_')[2];
                db[dbmodule].sanction = sanction
                await client.db.set(`antiraid_${message.guildId}`, db)
                i.deferUpdate();
                panel(dbmodule)
            }
        })

        async function dbGet(module) {
            const db = (await client.db.get(`antiraid_${message.guildId}`)) || {
                AntiSpam: {
                    sanction: "NONE",
                    salon: [],
                    temps: 3000,
                    messages: 5,
                    message: true,
                    status: false,
                    logs: {
                        status: false,
                        channel: null
                    },
                    wl: {
                        bypass: [],
                        wl: false,
                        buyers: true,
                        role: [],
                        user: []
                    }
                }, AddBot: {
                    sanction: "NONE",
                    salon: [],
                    message: false,
                    logs: {
                        status: false,
                        channel: null
                    },
                    wl: {
                        bypass: [],
                        wl: false,
                        buyers: true,
                        role: [],
                        user: []
                    }
                }
            };

            if (module) {
                return db[module];
            } else {
                return db
            }
        }
    }
}


function convertTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    let timeString = '';
    if (hours > 0) {
        timeString += hours + ' heures ';
    }
    if (remainingMinutes > 0) {
        timeString += remainingMinutes + ` minutes `;
    }
    if (remainingSeconds > 0) {
        timeString += remainingSeconds + ' secondes';
    }
    return timeString.trim();
}
