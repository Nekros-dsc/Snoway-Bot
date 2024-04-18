const Discord = require('discord.js');
const Snoway = require('../../structures/client/index')
module.exports = {
    name: "captcha",
    description: {
        fr: "Configure le système de captcha",
        en: "Configure the captcha system"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const emoji = {
            type: client.functions.emoji.param,
            temps: client.functions.emoji.temps,
            age: client.functions.emoji.age,
            salon: client.functions.emoji.channel,
            role: client.functions.emoji.users,
            retour: client.functions.emoji.retour
        }

        const db = (await client.db.get(`captcha_${message.guild.id}`)) || {
            type: 1,
            state: false,
            time: null,
            age: null,
            channel: null,
            role: null
        };

        const reply = await message.reply({ content: "Vérification des paramètres" });

        async function updateEmbed() {
            let TextCaptcha = "";
            switch (db.type) {
                case 1:
                    TextCaptcha = "Pin (ex: 1 3 4 8 4 5)";
                    break;
            }

            const channel = client.channels.cache.get(db.channel) || null;
            const role = message.guild.roles.cache.get(db.role) || null;

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTimestamp()
                .addFields(
                    { name: "・ Type de Captcha", value: `\`\`\`js\n${TextCaptcha}\`\`\`` }
                )
                .addFields(
                    { name: "・ Temps", value: `\`\`\`js\n${db.time ? formattemps(db.time) : "Non définie "}\`\`\``, inline: true },
                    { name: "・ Âge minimum", value: `\`\`\`js\n${db.age ? formattemps(db.age) : "Non définie "}\`\`\``, inline: true }
                )
                .addFields(
                    { name: "・ Salon", value: `\`\`\`js\n${channel?.name || "Non définie"} (ID: ${channel?.id || "Non définie"})\`\`\`` }
                )
                .addFields(
                    { name: "・ Rôle", value: `\`\`\`js\n${role?.name || "Non définie"} (ID: ${role?.id || "Non définie"})\`\`\`` }
                )
                .setFooter(client.footer);


            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('type')
                        .setEmoji(emoji["type"])
                        .setStyle(2),
                    new Discord.ButtonBuilder()
                        .setCustomId('temps')
                        .setEmoji(emoji["temps"])
                        .setStyle(2),
                    new Discord.ButtonBuilder()
                        .setCustomId('age')
                        .setEmoji(emoji["age"])
                        .setStyle(2),
                    new Discord.ButtonBuilder()
                        .setCustomId('channel')
                        .setEmoji(emoji["salon"])
                        .setStyle(2),
                    new Discord.ButtonBuilder()
                        .setCustomId('user')
                        .setEmoji(emoji["role"])
                        .setStyle(2),
                )
            reply.edit({
                embeds: [embed],
                components: [row],
                content: null
            });
        }

        updateEmbed();

        const collector = reply.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: "Vous n'êtes pas autorisé à utiliser cette interaction.",
                    flags: 64
                })
            }

            if (i.customId === "retour") {
                i.deferUpdate()
                updateEmbed()
            }

            if (i.customId === 'type') {
                i.reply({
                    content: "Indisponible pour le moment...",
                    ephemeral: true
                });
            } else if (i.customId === "user") {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("***Quel rôle souhaitez-vous assigner après la validation du captcha ?***")
                    .setFooter(client.footer);

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(emoji['retour'])
                            .setStyle(4)
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
                        db.role = role.id;
                        await client.db.set(`captcha_${message.guild.id}`, db);
                        updateEmbed();
                    } else {

                        const channel = client.channels.cache.get(response.first().channelId);
                        await channel.send({ content: "***Le rôle mentionné est invalide. Veuillez mentionner un rôle valide.***" });
                    }

                    response.first().delete().catch(() => { });
                }
            } else if (i.customId === "channel") {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("***Quel salon souhaitez-vous utiliser pour le captcha ?***")
                    .setFooter(client.footer);

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(emoji['retour'])
                            .setStyle(4)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const channelId = response.first().content.replace(/[<#>|]/g, '');
                    const channel = client.channels.cache.get(channelId);

                    if (channel) {
                        db.channel = channel.id;
                        await client.db.set(`captcha_${message.guild.id}`, db);
                        updateEmbed();
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const salon = await channel.send({ content: '***Le salon mentionné est invalide. Veuillez mentionner un salon valide.***' });
                        updateEmbed()
                        setTimeout(() => {
                            salon.delete().catch(() => { })
                        }, 8000)

                    }

                    response.first().delete().catch(() => { });
                }

            } else if (i.customId === "temps") {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`**Veuillez indiquer le temps qui sera disponible pour résoudre le captcha. (Min: 10s, Max: 3m)**\n\`Exemple: 2m ou 45s\``)
                    .setFooter(client.footer);

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(emoji['retour'])
                            .setStyle(4)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const imput = response.first().content;
                    const timeseconde = convertseconde(imput);
                    if (!isNaN(timeseconde) && timeseconde >= 10 && timeseconde <= 180) {
                        db.time = timeseconde
                        await client.db.set(`captcha_${message.guild.id}`, db)
                        updateEmbed()
                        response.first().delete().catch(() => { })
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const time = await channel.send({ content: "***Le temps entré est invalide. Assurez-vous que c\'est entre 10 secondes et 3 minutes.***" })
                        response.first().delete().catch(() => { })
                        updateEmbed()
                        setTimeout(() => {
                            time.delete().catch(() => { })
                        }, 8000)
                    }
                }
            } else if (i.customId === "age") {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`**Veuillez indiquer l'âge minimum du compte sous peine d'être exclu. (Min: 1s)**\n\`Exemple: 2y, 4M, 12d, 40h, 12m, 10s\``)
                    .setFooter(client.footer);

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('retour')
                            .setEmoji(emoji['retour'])
                            .setStyle(4)
                    );

                i.update({
                    content: null,
                    embeds: [embed],
                    components: [row]
                });

                const filter = (response) => response.author.id === i.user.id;
                const response = await i.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

                if (response && response.first()) {
                    const ageInput = response.first().content;
                    const convertAge = convertseconde(ageInput);
                    response.first().delete().catch(() => { })
                    if (!isNaN(convertAge) && convertAge >= 1) {
                        db.age = convertAge
                        await client.db.set(`captcha_${message.guild.id}`, db)
                        updateEmbed()
                    } else {
                        const channel = client.channels.cache.get(response.first().channelId);
                        const age = await channel.send({ content: "***L'âge entré est invalide. Assurez-vous que c'est supérieur à 1 seconde.***" });
                        updateEmbed()
                        setTimeout(() => {
                            age.delete().catch(() => { })
                        }, 8000)

                    }
                }
            }
        });
    }
};



function formattemps(temps) {
    let time;

    if (temps < 60) {
        time = `${temps} secondes`;
    } else if (temps < 3600) {
        const minutes = Math.floor(temps / 60);
        time = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (temps < 86400) {
        const heures = Math.floor(temps / 3600);
        time = `${heures} heure${heures !== 1 ? 's' : ''}`;
    } else if (temps < 31536000) {
        const jours = Math.floor(temps / 86400);
        time = `${jours} jour${jours !== 1 ? 's' : ''}`;
    } else {
        const années = Math.floor(temps / 31536000);
        time = `${années} an${années !== 1 ? 's' : ''}`;
    }

    return time;
}

function convertseconde(input) {
    let totalSeconds = 0;

    if (typeof input === 'string') {
        const time = input.match(/\d+[smhdMy]?/g);

        if (time) {
            for (const unit of time) {
                const match = unit.match(/(\d+)([smhdMy]?)/);
                if (match) {
                    const value = parseInt(match[1]);
                    const type = match[2].toLowerCase();

                    switch (type) {
                        case 'm':
                            totalSeconds += value * 60;
                            break;
                        case 'h':
                            totalSeconds += value * 3600;
                            break;
                        case 'd':
                            totalSeconds += value * 86400;
                            break;
                        case 'y':
                            totalSeconds += value * 31536000;
                            break;
                        default:
                            totalSeconds += value;
                            break;
                    }
                }
            }
        }
    }

    return totalSeconds;
}