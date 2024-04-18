const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'giveaway',
    aliases: ["giveaways", "gsart", "gw"],
    description: {
        fr: 'Permet de lancer un giveaway',
        en: "Launch a giveaway"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {

        async function update() {
            const db = await client.db.get(`gwconfig_${message.guildId}`) || {
                prix: "Bonbon x1",
                dure: 600000,
                emoji: "🎉",
                type: 1,
                salon: null,
                wins: 1,
                roleinterdit: [],
                rolerequis: [],
                vocal: false
            }

            const rolesRequis = await Promise.all(db.rolerequis.map(roleId => message.guild.roles.cache.get(roleId)));
            const rolesInterdit = await Promise.all(db.roleinterdit.map(roleId => message.guild.roles.cache.get(roleId)));
            const salon = client.channels.cache.get(db.salon) || "Aucun"

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle('Paramètre du giveaway')
                .addFields(
                    { name: "Gain", value: `\`\`\`js\n${db.prix}\`\`\``, inline: true },
                    { name: "Durée", value: `\`\`\`js\n${date(db.dure)}\`\`\``, inline: true },
                    { name: "Salon", value: `\`\`\`js\n${salon?.name || "Aucun"}\`\`\``, inline: true },
                    { name: "Rôle interdit", value: `\`\`\`js\n${rolesInterdit.map(role => role?.name).join(', ') || "Aucun"}\`\`\``, inline: true },
                    { name: "Rôle obligatoire", value: `\`\`\`js\n${rolesRequis.map(role => role?.name).join(', ') || "Aucun"}\`\`\``, inline: true },
                    { name: "Présence en vocal", value: `\`\`\`js\n${db.vocal ? "✅" : "❌"}\`\`\``, inline: true },
                    { name: "Emoji", value: `${db.emoji}`, inline: true },
                )

            const select = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select')
                        .addOptions({
                            label: 'Modifier le gain',
                            emoji: "🎁",
                            value: "gain"
                        }, {
                            label: 'Modifier la durée',
                            emoji: "⏱",
                            value: "duree"
                        }, {
                            label: 'Modifier le salon',
                            emoji: "🏷",
                            value: "salon"
                        }, {
                            label: 'Modifier l\'emoji',
                            emoji: "🎉",
                            value: "emoji"
                        }, {
                            label: 'Modifier le rôle obligatoire',
                            emoji: "⛓",
                            value: "obligatoire"
                        }, {
                            label: 'Modifier le rôle interdit',
                            emoji: "🚫",
                            value: "interdit"
                        }, {
                            label: 'Modifier l\'obligation d\'être en vocal',
                            emoji: "🔊",
                            value: "vocal"
                        })
                )

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('start')
                        .setStyle(2)
                        .setLabel('Lancer le giveaway')
                        .setEmoji('🚀')
                )

            return {
                embed,
                select,
                button
            }
        }

        const msg = await message.channel.send({
            embeds: [(await update()).embed],
            components: [(await update()).select, (await update()).button]
        })

        const collecor = msg.createMessageComponentCollector()

        collecor.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }

            const db = await client.db.get(`gwconfig_${message.guildId}`) || {
                prix: "Bonbon x1",
                dure: Date.now() + 600000,
                emoji: "🎉",
                host: message.author.id,
                predef: null,
                type: 1,
                salon: null,
                wins: 1,
                roleinterdit: [],
                rolerequis: [],
                vocal: false
            };

            switch (i.customId) {

                case 'start':
                    await i.deferReply({ ephemeral: true });
                    const channel = client.channels.cache.get(db.salon)
                    if(!channel) {
                        return i.editReply({
                            content: "Le salon des giveaways n'est pas configuré"
                        })
                    }

                    const code = await client.functions.bot.code()
    
                    const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter({text: "Giveaway code: " + code})
                    .setTitle('Giveaway: ' + db.prix)
                    .setDescription(`Réagissez sur le button pour participer !\nNombre de gagnants : 1`)
                    .addFields(
                        {name: "Fin du giveaway", value: `<t:${Math.floor((Date.now() + db.dure) / 1000)}:R>`}
                    )

                    const row = new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                    .setEmoji(db.emoji)
                                    .setCustomId('giveaway_entry_' + code)
                                    .setStyle(Discord.ButtonStyle.Primary),
                                    new Discord.ButtonBuilder()
                                    .setLabel('Liste des participants')
                                    .setCustomId('giveaway_list_' + code)
                                    .setStyle(Discord.ButtonStyle.Secondary)
                                )

                    const mss = await channel.send({
                        embeds: [embed],
                        components: [row]
                    })

                    const dbgw = {
                        participant: [],
                        messageId: mss.id,
                        author: i.user.id, 
                        create: Date.now(),
                        end: false,
                        endTime: Date.now() + db.dure,
                        endAuthor: null,
                        code: code,
                        prix: db.prix,
                        wins: db.wins,
                        dure: db.dure,
                        emoji: db.emoji,
                        salon: db.salon,
                        roleinterdit: db.roleinterdit,
                        rolerequis: db.rolerequis,
                        vocal: db.vocal 
                    }

                    await client.db.push(`giveaways_${message.guildId}`, dbgw)
                    await client.db.set(`giveaway_${message.guild.id}_${code}`, dbgw);

                    i.editReply({
                        content: 'Giveaway lancé',
                        components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setStyle(5).setURL(`https://discord.com/channels/${message.guildId}/${channel.id}/${mss.id}`).setLabel('Lien du giveaway'))]
                    })
                    break;

                case 'select':
                    i.deferUpdate()
                    if (i.values[0] === "vocal") {
                        db.vocal = !db.vocal;
                        await client.db.set(`gwconfig_${message.guildId}`, db);
                        msg.edit({ embeds: [(await update()).embed] });
                    } else if (i.values[0] === "gain") {
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

                        const reply = await msg.reply("Veuillez entrer le nouveau gain :");

                        collector.on('collect', async (messages) => {
                            const newGain = messages.content;
                            db.prix = newGain;
                            await client.db.set(`gwconfig_${message.guildId}`, db);
                            reply.delete().catch(() => { })
                            messages.delete().catch(() => { })
                            msg.edit({ embeds: [(await update()).embed] });
                            collector.stop();
                        });

                        collector.on('end', () => { });
                    } else if (i.values[0] === "duree") {
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

                        const reply = await message.reply("Veuillez entrer la nouvelle durée, par exemple \`10h, 3j, 30m\`");

                        collector.on('collect', async (msgs) => {
                            const input = msgs.content.trim().toLowerCase();
                            const regex = /^(\d+)([hjms])$/;
                            const match = input.match(regex);

                            if (match) {
                                const value = parseInt(match[1]);
                                const unit = match[2];
                                let multiplier = 1;

                                switch (unit) {
                                    case 'h':
                                        multiplier = 3600;
                                        break;
                                    case 'j':
                                    case 'd':
                                        multiplier = 86400;
                                        break;
                                    case 'm':
                                        multiplier = 60;
                                        break;
                                    case 's':
                                        multiplier = 1;
                                        break;
                                }

                                const newDurationMilliseconds = value * multiplier * 1000;
                                db.dure = newDurationMilliseconds;
                                await client.db.set(`gwconfig_${message.guildId}`, db);

                                reply.delete().catch(() => { });
                                msgs.delete().catch(() => { });
                                msg.edit({ embeds: [(await update()).embed] });
                                collector.stop();
                            } else {
                                const erremsg = message.reply("Veuillez entrer une durée valide au format [nombre][unité], par exemple 10h, 3j, 30m.");
                                setTimeout(() => {
                                    erremsg.delete().catch(() => { })
                                }, 3000)
                            }
                        });

                        collector.on('end', () => {

                        });
                    } else if (i.values[0] === "salon") {
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

                        const reply = await message.reply("Veuillez mentionner le nouveau salon pour le giveaway :");

                        collector.on('collect', async (msgs) => {
                            const channelId = msgs.content.replace(/[<#>|]/g, '');
                            const newChannel = client.channels.cache.get(channelId);
                            if (newChannel) {
                                db.salon = newChannel.id;
                                await client.db.set(`gwconfig_${message.guildId}`, db);

                                reply.delete().catch(() => { });
                                msgs.delete().catch(() => { });
                                const updatedEmbed = (await update()).embed;
                                msg.edit({ embeds: [updatedEmbed] });
                                collector.stop();
                            } else {
                                message.reply("Veuillez mentionner un salon valide.");
                            }
                        });

                        collector.on('end', () => { });
                    } else if (i.values[0] === "emoji") {
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

                        const reply = await message.reply("Veuillez entrer le nouvel emoji pour le giveaway :");

                        collector.on('collect', async (msgs) => {
                            const newEmoji = msgs.content.trim();
                            const emojiID = emojID(client, newEmoji)
                            const valideEmoji = valide(client, newEmoji)
                            if (!valideEmoji || !emojiID) {
                                const emojiRegex = /<(a)?:\w+:\d+>|[\u{1F000}-\u{1FFFF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]/gu;
                                if (emojiRegex.test(newEmoji)) {
                                    db.emoji = newEmoji;
                                    await client.db.set(`gwconfig_${message.guildId}`, db);

                                    reply.delete().catch(() => { });
                                    msgs.delete().catch(() => { });
                                    const updatedEmbed = (await update()).embed;
                                    msg.edit({ embeds: [updatedEmbed] });
                                    collector.stop();
                                }
                            } else {
                                message.reply("Veuillez entrer un emoji valide.");
                            }
                        });

                        collector.on('end', () => { });
                    } else if (i.values[0] === "interdit") {
                        const reply = await message.reply("Veuillez mentionner le nouveau rôle interdit pour le giveaway :");
                        const filter = (response) => response.author.id === i.user.id;
                        try {
                            const collectedMessages = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                            if (collectedMessages && collectedMessages.first()) {
                                const roleId = collectedMessages.first().content.replace(/[<@&>|]/g, '');
                                const role = message.guild.roles.cache.get(roleId);

                                if (role) {
                                    const roleIsForbidden = db.roleinterdit.includes(role.id);

                                    if (roleIsForbidden) {
                                        const index = db.roleinterdit.indexOf(role.id);
                                        if (index !== -1) {
                                            db.roleinterdit.splice(index, 1);
                                            await client.db.set(`gwconfig_${message.guild.id}`, db);
                                        }
                                    } else {
                                        db.roleinterdit.push(role.id);
                                        await client.db.set(`gwconfig_${message.guild.id}`, db);

                                    }
                                } else {
                                    const channel = client.channels.cache.get(collectedMessages.first().channelId);
                                    await channel.send({ content: "Le rôle donné est invalide." });
                                }

                                reply.delete().catch(() => { })
                                msg.edit({
                                    embeds: [(await update()).embed]
                                })
                                collectedMessages.first().delete().catch(() => { });
                            }
                        } catch (error) {
                            console.error("Erreur:", error);
                        }
                    } else if (i.values[0] === "obligatoire") {
                        const reply = await message.reply("Veuillez mentionner le nouveau rôle obligatoire pour le giveaway :");
                        const filter = (response) => response.author.id === i.user.id;
                        try {
                            const collectedMessages = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                            if (collectedMessages && collectedMessages.first()) {
                                const roleId = collectedMessages.first().content.replace(/[<@&>|]/g, '');
                                const role = message.guild.roles.cache.get(roleId);

                                if (role) {
                                    const roleIsForbidden = db.rolerequis.includes(role.id);

                                    if (roleIsForbidden) {
                                        const index = db.rolerequis.indexOf(role.id);
                                        if (index !== -1) {
                                            db.rolerequis.splice(index, 1);
                                            await client.db.set(`gwconfig_${message.guild.id}`, db);
                                        }
                                    } else {
                                        db.rolerequis.push(role.id);
                                        await client.db.set(`gwconfig_${message.guild.id}`, db);

                                    }
                                } else {
                                    const channel = client.channels.cache.get(collectedMessages.first().channelId);
                                    await channel.send({ content: "Le rôle donné est invalide." });
                                }

                                reply.delete().catch(() => { })
                                msg.edit({
                                    embeds: [(await update()).embed]
                                })
                                collectedMessages.first().delete().catch(() => { });
                            }
                        } catch (error) {
                            console.error("Erreur:", error);
                        }
                    }

                    break;
            }



        })


    },
};



function date(durationInMilliseconds) {
    const years = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

    let formattedDuration = '';

    if (years > 0) formattedDuration += years + 'y ';
    if (days > 0) formattedDuration += days + 'd ';
    if (hours > 0) formattedDuration += hours + 'h ';
    if (minutes > 0) formattedDuration += minutes + 'm ';
    if (seconds > 0 || formattedDuration === '') formattedDuration += seconds + 's ';

    return formattedDuration.trim();
}


function valide(client, emoji) {
    return client.emojis.cache.has(emoji);
}


function emojID(client, emoji) {
    const regex = /<a?:\w+:(\d+)>/;
    const match = emoji.match(regex);
    return match ? match[1] : null;
}