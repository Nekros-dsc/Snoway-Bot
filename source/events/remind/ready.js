const { EmbedBuilder } = require("@discordjs/builders");
const Snoway = require("../../structures/client/index");
const ms = require('../../structures/Utils/ms');

module.exports = {
    name: "ready",
    /**
     * @param {Snoway} client
     */
    run: async (client) => {
        setInterval(() => { checkReminders(client); }, ms('10s'));
    }
};

async function checkReminders(client) {
    const db = await client.db.get(`reminders`);
    const color = parseInt(client.config.color.replace("#", ""), 16);
    if (Array.isArray(db)) {
        for (const reminder of db) {
            const now = Date.now();
            if (reminder.time <= now) {
                const user = client.users.cache.get(reminder.user);

                if (user) {
                    user.send({
                        content: null,
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setFooter(client.footer)
                                .setDescription(`${await client.lang('remid.hello')} ${user}, ${await client.lang('remid.rappelle')} \`${reminder.reminder}\``)
                        ]
                    });
                }
                const updatedReminders = db.filter(r => r.id !== reminder.id);
                await client.db.set(`reminders`, updatedReminders);

            }
        }
    } else {
        return;
    }
}
