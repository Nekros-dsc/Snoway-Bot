const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const Snoway = require('../../structures/client/index')
const Discord = require('discord.js')
module.exports = {
    name: "userinfo",
    aliases: ["ui"],
    description: {
        fr: "Permet d'obtenir des informations sur un utilisateur",
        en: "To obtain information about a user"
    },
    usage: {
        fr: { "userinfo <id/mention>": "Permet d'obtenir des informations sur un utilisateur" },
        en: { "userinfo <id/mention>": "To obtain information about a user" }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Snoway} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let target;

        if (message.mentions.members.first()) {
            target = message.mentions.members.first();
        } else if (args[0]) {
            try {
                target = await message.guild.members.fetch(args[0]);
            } catch (error) {
                return message.channel.send("Cette Utilisateur est introuvable");
            }
        } else {
            target = message.member;
        }

        const user = target.user;
        const member = target;
        let text = "Aucun rôle";
        const author = message.author.id === user.id

        if (member) {
            const roles = member.roles.cache
                .filter(role => role.name !== "@everyone")
                .map(role => role.toString());
            if (roles.length <= 3) {
                text = roles.join(', ');
            } else {
                const roleplus = roles.length - 4;
                if (roleplus > 0) {
                    text = roles.slice(0, 3).join(', ') + ` +${roleplus} autre${roleplus > 1 ? 's' : ''} rôle${roleplus > 1 ? 's' : ''}`;
                } else {
                    text = roles.slice(0, 3).join(', ');
                }
            }
        }
        const varsbadge = {
            'HypeSquadOnlineHouse1': "HypeSquad Bravery",
            'HypeSquadOnlineHouse2': "HypeSquad Brilliance",
            'HypeSquadOnlineHouse3': "HypeSquad Balance",
            'HypeSquadEvents': "HypeSquad Event",
            'ActiveDeveloper': 'Active Developer',
            'BugHunterLeve1': 'Bug Hunter Level 1',
            'EarlySupporter': 'Early Supporter',
            'VerifiedBotDeveloper': 'Verified Bot Developer',
            'EarlyVerifiedBotDeveloper': "Early Verified Bot Developer",
            'VerifiedBot': "Verified Bot",
            'PartneredServerOwner': "Partnered Server Owner",
            'Staff': "Discord Staff",
            'System': "Discord System",
            'BugHunterLevel2': 'Bug Hunter Level 2',
        }
        const badges = user.flags.toArray();
        const userBadges = badges
            .filter(badge => varsbadge[badge])
            .map(badge => varsbadge[badge]);

        const nitro = (await client.functions.bot.user(user.id)).premium_type
        switch (nitro) {
            case 0:
                break;
            case 1:
                userBadges.push('Nitro Classic');
                break;
            case 2:
                userBadges.push('Nitro Boost');
                break;
            case 3:
                userBadges.push('Nitro Basic');
                break;
        }
        const activities = member.presence?.activities
            ? member.presence.activities
                .filter(activity => activity.type !== 4)
                .map((activity) => `- \`${activity.name} (${activity.state})\``)
            : [];

        let status = member.presence?.status || 'offline';
        switch (status) {
            case 'online':
                status = '🟢';
                break;
            case 'idle':
                status = '🌙';
                break;
            case 'dnd':
                status = '⛔';
                break;
            default:
                status = '⚫';
        }
        let statusperso = member.presence?.activities[0]?.state || null;
        if (statusperso === null) {
            statusperso = "Aucun status personnalisé";
        }
        const platforms = Object.keys(member.presence?.clientStatus || { 'offline': 'offline' }).filter(
            key => ['online', 'dnd', 'idle', 'offline'].includes(member.presence?.clientStatus[key])
        );

        let platfor = platforms.map(platform => {
            if (platform === 'desktop') return '🖥️ Ordinateur';
            if (platform === 'mobile') return '📱 Téléphone';
            if (platform === 'web') return '🌐 Navigateur';
            if (platform === 'offline') return 'Aucune';
            if (platform === null) return 'Aucune';
        }).join(' / ')

        const infomembre = `\n> **Name:** \`${user.discriminator === 0 ? user.username : user.tag}\` / ${user}\n> **ID:** \`${user.id}\`\n> **Bot:** ${user.bot ? '\`✅\`' : '\`❌\`'}\n> **Badge(s):** \`${userBadges.length ? userBadges.join('\`, \`') : "`❌`"}\`\n> **Création du compte :** <t:${Math.floor(user.createdAt / 1000)}:f>\n> **Connecté depuis** ${member.presence?.activities[0] ? `<t:${Math.floor(member.presence?.activities[0]?.createdTimestamp / 1000)}:f>` : "Aucune donnée"}`;
        const infoserv = `\n\n> **Présent sur le serveur depuis:** <t:${Math.floor(member.joinedAt / 1000)}:F>\n> **Booster:** ${member.premiumSince ? `*Depuis le* <t:${Math.floor(member.premiumSince.getTime() / 1000)}:F>` : "`❌`"}\n> **Rôle(s):** ${text || "Aucun"}`

        const url = await user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Informations sur ${user.username}`)
            .setThumbnail(user.avatarURL())
            .setDescription(`**__Informations Principales__**\n${infomembre}\n\n**__Activité(s) en cours__**\n\n> **Status:** (\`${status}\`) \`${statusperso}\`\n> **Platforme:** \`${platfor || "Aucune"}\`\n> **Activité: ${activities.length !== 0 ? `(${activities.length})` : ""}**\n${activities.join('\n') || "> - **Aucune activité**"}\n\n__**Informations sur le serveur**__ ${infoserv}`)
            .setImage(url)
            .setFooter(client.footer)
            .setImage(user.bannerURL({ format: 'png', size: 4096 }))
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('del')
                    .setStyle(2)
                    .setEmoji(client.functions.emoji.del),
            )
        const reply = await message.reply({ embeds: [embed], components: [row] });

        const collector = reply.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                if (i.user.id !== user.id) {
                    return i.reply({
                        content: await client.lang('interaction'),
                        flags: 64
                    })
                }
            }

            if (i.customId === 'del') {
                i.message.delete()
            }
           
        })
    }
}

