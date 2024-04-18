const Discord = require('discord.js');
const ms = require('ms');
const Snoway = require('../../structures/client/index')

const raid = new Map();

module.exports = {
    name: 'messageCreate',
    /**
  * @param {Snoway} client
  * @param {Discord.Message} message
  */
    run: async (client, message) => {
        if (!message.guild || message.author.bot || message.author.id === message.guild.ownerId || message.author.id === client.user.id || client.config.buyers.includes(message.author.id)) return;
        const member = message.member;
        const db = await client.db.get(`antiraid_${message.guildId}.AntiSpam`);
        if (!db || !db.status || db.salon.includes(message.channelId)) return;

        const userId = message.author.id;

        if (raid.has(userId)) {
            const userData = raid.get(userId);

            const lastMessageTime = userData.lastMessageTime;
            const currentTime = Date.now();
            if (currentTime - lastMessageTime < db.temps && userData.messages.length >= db.messages) {
                userData.lastMessageTime = currentTime;

                clearTimeout(userData.warnTimeout);
                userData.warnTimeout = setTimeout(() => {
                    if (!userData.warn) {
                        userData.warn = true;
                        switch (db.sanction) {
                            case "BAN":
                                message.member.ban({ reason: "Snoway - Antispam" });
                                break;
                            case "KICK":
                                message.member.kick("Snoway - Antispam");
                                break;
                            case "MUTE":
                                message.member.roles.set([]);
                                message.member.timeout(ms('15s'), { reason: "Snoway - Antispam" });
                                break;
                            default:
                                break;
                        }

                        sendNtm(client, Array.from(raid.keys()), message.channel.id, Array.from(raid.values()), db);
                        resetSpamData(Array.from(raid.values()), message.channel);
                    }
                }, db.temps);

                if (!userData.messages) {
                    userData.messages = [];
                }

                userData.messages.push(message);

                return;
            } else {
                setTimeout(() => {
                    if (currentTime - lastMessageTime >= 3000 && userData.messages.length === 0) {
                        raid.delete(userId);
                    }
                }, db.temps);
            }
        }

        raid.set(userId, {
            lastMessageTime: Date.now(),
            messages: [message]
        });
    }
}

function sendNtm(client, userIds, channelId, userDataArray, db) {
    if (userIds.length === 0) return;
    const messagesToDelete = userDataArray.reduce((acc, userData) => {
        if (userData && userData.messages) {
            acc.push(...userData.messages.map(msg => msg.id));
        }
        return acc;
    }, []);
    const warningMessage = `${userIds.map(userId => `<@${userId}>`).join(', ')}, Le spam est interdit sur ce serveur !`;
    const channel = client.channels.cache.get(channelId)
    channel.send(warningMessage).then((m) => setTimeout(() => m.delete(), 3000));
    const mentionUsers = userIds.map(userId => {
        const user = client.users.cache.get(userId)
        return `${user.username} (ID: ${user.id})`
    }).join('\n')


    let embed = new Discord.EmbedBuilder()
        .setFooter({ text: `${messagesToDelete.length || 0} messages supprimés dans ${channel.name}`, iconURL: channel.guild.iconURL() })
        .setTimestamp()
        .setAuthor({ name: "・ Actions non autorisées" })
        .addFields({ name: "・Utilisateurs", value: `\`\`\`py\n${mentionUsers}\`\`\`` })
        .addFields({ name: "・Sanction", value: `\`\`\`py\n${db.sanction}\`\`\`` })
        .addFields({ name: "・Modifications apportées", value: "\`\`\`py\nMessages contenants du spam\`\`\`" })
        .setColor(client.color);
    const logsChannel = client.channels.cache.get(db.logs.channel)
    if (db.logs.status && logsChannel) {
        logsChannel?.send({ embeds: [embed] })
    }
}

async function resetSpamData(userDataArray, channel) {
    const messagesToDelete = userDataArray.reduce((acc, userData) => {
        if (userData && userData.messages) {
            acc.push(...userData.messages.map(msg => msg.id));
        }
        return acc;
    }, []);

    let index = 0;

    while (index < messagesToDelete.length) {
        const messagesBatch = messagesToDelete.slice(index, index + 99);
        try {
            await channel.bulkDelete(messagesBatch);
        } catch (error) {
            console.error('Erreur:', error);
        }
        index += 99;
    }

    raid.clear();
}