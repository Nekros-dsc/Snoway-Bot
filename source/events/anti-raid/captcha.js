const Discord = require('discord.js');
const Snoway = require('../../structures/client/index')

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Snoway} client
     * @param {Discord.GuildMember} member
     */
    run: async (client, member) => {
        if (!member || member?.bot) return;
        const db = await client.db.get(`captcha_${member.guild.id}`)
        if (!db) return;
        const accountCreationDate = member.user.createdAt;
        const color = await client.db.get(`color_${member.guild.id}`) || client.config.color
        const milletime = new Date() - accountCreationDate;
        const timediff = Math.floor(milletime / 1000);
        const times = db.age ? db.age : 0
        if (timediff < times) {
            console.log(`L'utilisateur ${member.user.tag} a un compte trop récent.`);
            await member.kick({ reason: "Compte créé trop récemment" });
            return;
        }

        let table = {
            rate: 0,
            code: unkownCode(),
            userCode: ""
        }

        const buttons = Array.from({ length: 10 }, (_, index) =>
            new Discord.ButtonBuilder()
                .setCustomId(`code_${index === 9 ? 0 : index + 1}`)
                .setLabel((index === 9 ? 0 : index + 1).toString())
                .setStyle(2)
                .setDisabled(table.code.indexOf(index === 9 ? 0 : index + 1) === -1)
        );

        const groupbutton = [];
        while (buttons.length > 0) {
            groupbutton.push(buttons.splice(0, 5));
        }

        const rowNumber = groupbutton.map(group => new Discord.ActionRowBuilder().addComponents(...group));

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('valide')
                    .setStyle(1)
                    .setEmoji(client.functions.emoji.valide),
                new Discord.ButtonBuilder()
                    .setCustomId('clear')
                    .setStyle(4)
                    .setEmoji(client.functions.emoji.no),
            );

        const channel = client.channels.cache.get(db.channel);
        if (!channel) return;
        const message = await channel.send({
            content: `${member.user}, suivez les instructions ci-dessous.`,
            embeds: [modifEmbed(client, table, null, color)],
            components: [...rowNumber, row]

        });
        const time = db.time * 1000 || 60000
        const collector = message.createMessageComponentCollector({ filter: (i) => i.isButton(), time: time });

        collector.on('collect', async (i) => {
            if (i.user.id !== member.user.id) return i.reply({ content: "" })

            if (i.customId === 'valide') {
                if (table.userCode === table.code.replace(/ /g, '')) {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(color)
                        .setFooter(client.footer)
                        .setDescription(`Captcha réussi, vous allez recevoir les rôles suivant: <@&${db.role}>`)
                    i.reply({ embeds: [embed], flags: 64 })
                    await member.roles.add(db.role).catch(() => { });
                    message.delete().catch(() => { })
                    collector.stop();
                } else {
                    i.deferUpdate()
                    table.userCode = "";
                    message.edit({ embeds: [modifEmbed(client, table, "Code incorrect. Veuillez réessayer.", color)] });
                }
            } else if (i.customId === 'clear') {
                i.deferUpdate()
                table.userCode = "";
                message.edit({ embeds: [modifEmbed(client, table, null, color)] });
            } else {
                i.deferUpdate()
                table.userCode += i.customId.split('_')[1];
                message.edit({ embeds: [modifEmbed(client, table, null, color)] });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                console.log('Kick de ' + member.user.username + " pour captcha non résolue")
                member.kick({ reason: "Captcha non résolue" })
                message.delete().catch(() => { })
            }
        });
    }
};

function unkownCode() {
    const characters = '123456789';
    const idLength = 6;
    let result = '';

    for (let i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        if (i < idLength - 1) {
            result += ' ';
        }
    }

    return result;
}

function modifEmbed(client, table, erreurmsg = null, color) {
    const embed = new Discord.EmbedBuilder()
        .addFields(
            { name: "・ Code à saisir", value: `\`\`\`js\n${table.code}\`\`\`` },
            { name: "・ Instructions", value: `\`\`\`js\nVeuillez saisir le code au-dessus à l'aide des boutons puis de valider votre code. En cas d'échec, vous serez expulsé du serveur.\`\`\`` },
            { name: "・ Code saisi", value: `\`\`\`js\n${(table.userCode || " ").split('').join(' ')}\`\`\`` }
        )
        .setColor(color)
        .setTimestamp()
        .setFooter(client.footer);

    if (erreurmsg) {
        embed.setDescription(erreurmsg);
    }

    return embed;
}