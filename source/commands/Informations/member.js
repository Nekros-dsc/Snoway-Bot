const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: 'member',
    description: {
        fr: "Affiche les statistiques des channels vocal et des messages d'un membre mentionné ou de vous-même",
        en: "Displays statistics on voice channels and messages from a named member or yourself"
    },
    usage: {
        fr: { "member [mention/id]": "Permet d'afficher les statistiques d'un membre" },
        en: { "member [mention/id]": "Display member statistics" }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const cible = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const userId = cible.id;
        const guildId = message.guild.id;
        const vocalData = await client.db.get(`vocal_${guildId}_${userId}`) || { channels: [], last: null };
        const msgdata = await client.db.get(`stats_message_${userId}_${guildId}`) || { channels: [], last: null }
        const guild = client.guilds.cache.get(message.guild.id);
        const targetMember = guild.members.cache.get(cible.id);

        let text = "Aucun rôle";

        if (targetMember) {
            const roles = targetMember.roles.cache
                .filter(role => role.name !== "@everyone")
                .map(r => r.toString());
            if (roles.length <= 3) {
                text = roles.join(', ');
            } else {
                const extraRoles = roles.length - 4;
                if (extraRoles > 0) {
                    text = roles.slice(0, 3).join(', ') + ` +${extraRoles} autre${extraRoles > 1 ? 's' : ''} rôle${extraRoles > 1 ? 's' : ''}`;
                } else {
                    text = roles.slice(0, 3).join(', ');
                }
            }
        }

        let totalvoc = 0;
        vocalData.channels.forEach(channel => {
            totalvoc += channel.voc;
        });
        const vocaltemps = formattemps(totalvoc);

        let totalMessages = 0;
        msgdata.channels.forEach(channel => {
            totalMessages += channel.message;
        });

        const sowt = msgdata.channels.sort((a, b) => b.message - a.message);
        const chns = sowt.slice(0, 10);
        let top = 0;

        const messagetops = chns
        .filter(channel => {
            const chanobject = message.guild.channels.cache.get(channel.channelId);
            return chanobject !== undefined;
        })
        .map((channel, index) => {
            top++;
            const chanobject = message.guild.channels.cache.get(channel.channelId);
    
            return `\`${top}.\` ${chanobject}: \`${channel.message} message(s)\``;
        })
        .join('\n');


        const sown = vocalData.channels.sort((a, b) => b.channelId - a.channelId);
        const chnvoc = sown.slice(0, 10);
        let topvoc = 0;
        const vocaltops = chnvoc.map(channel => {
            topvoc++;
            const voca = formattemps(channel.voc);
            const channels = message.guild.channels.cache.get(channel.channelId);
            return channels ? `\`${topvoc}.\` ${channels} \`${voca}\`` : `\`${top}.\`#salon-introuvable \`${voca}\``;
        }).join('\n');

        const user = await client.functions.bot.user(cible.id)
        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${cible.id}/${user.avatar}`)
            .setImage(user.banner ? `https://cdn.discordapp.com/banners/${cible.id}/${user.banner}.webp?size=4096` : null)
            .setTitle('Information du membre')
            .setDescription(`__**ID :**__ \`${cible.id}\`\n__**Rôles:**__ ${text || "\`Aucun rôle\`"}\n__**Username**__ : \`${cible.username}\`\n\n**Activité vocal**\nTemps Total : \`${vocaltemps}\`\nDernière activitée: ${vocalData.last !== null ? `<t:${Math.floor(vocalData.last / 1000)}:R>` : "__*Aucune donnée*__"}\n${vocaltops}\n\n**Activité message**\nNombre total: \`${totalMessages}\`\nDernière activitée: ${msgdata.last !== null ? `<t:${Math.floor(msgdata.last / 1000)}:R>` : " "}\n${messagetops || "__*Aucune donnée*__"}`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};

function formattemps(temps) {
    let time;

    if (temps < 60) {
        time = `${temps} secondes`;
    } else if (temps < 3600) {
        const minutes = Math.floor(temps / 60);
        const seconds = temps % 60;
        time = `${minutes} minute${minutes !== 1 ? 's' : ''} et ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
    } else if (temps < 86400) {
        const heures = Math.floor(temps / 3600);
        const minutes = Math.floor((temps % 3600) / 60);
        time = `${heures} heure${heures !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (temps < 31536000) {
        const jours = Math.floor(temps / 86400);
        const heures = Math.floor((temps % 86400) / 3600);
        time = `${jours} jour${jours !== 1 ? 's' : ''}, ${heures} heure${heures !== 1 ? 's' : ''}`;
    } else {
        const années = Math.floor(temps / 31536000);
        const jours = Math.floor((temps % 31536000) / 86400);
        time = `${années} an${années !== 1 ? 's' : ''}, ${jours} jour${jours !== 1 ? 's' : ''}`;
    }

    return time;
}
