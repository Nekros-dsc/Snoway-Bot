const Snoway = require("../../structures/client/index");

module.exports = {
    name: "ready",
    /**
     * @param {Snoway} client
     */
    run: async (client) => {
        setInterval(() => {
            client.guilds.cache.forEach(guild => {
                guild.members.cache.forEach(member => {
                    if (member.voice.channel && !member.voice.afk && !member.user.bot) {
                        const userId = member.user.id;
                        const guildId = guild.id;
                        const dbKey = `vocal_${guildId}_${userId}`;
                        client.db.get(dbKey).then(db => {
                            db = db || { channels: [], last: Date.now() };

                            const channelId = member.voice.channel.id;
                            const channelIndex = db.channels.findIndex(channel => channel.channelId === channelId);

                            if (channelIndex !== -1) {
                                db.channels[channelIndex].voc += 1;
                            } else {
                                db.channels.push({
                                    channelId: channelId,
                                    voc: 1
                                });
                            }
                            db.last = Date.now();
                            client.db.set(dbKey, db);
                        }).catch(error => {
                            console.error("Erreur:", error);
                        });
                    }
                });
            });
        }, 1000);
    }
};
