const Discord = require("discord.js");
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "ready",
    /**
     *
     * @param {Snoway} client
     */
    run: async (client) => {
       setInterval(async () => {
            const db = await client.db.get(`status`)
            const presenceOptions = {
                status: db?.status || 0,
                activities: [{
                    name: db?.name || "Snoway V" + client.version + " .gg/snoway",
                    type: db?.type || 4,
                    url: "https://twitch.tv/oni145"

                }]
            };
            client.user.setPresence(presenceOptions)

        }, 5000)
    }
};
