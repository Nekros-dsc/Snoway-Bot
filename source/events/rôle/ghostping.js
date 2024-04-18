const Discord = require("discord.js");
const Snoway = require("../../structures/client/index");
const { sleep } = require('../../structures/Functions/sleep');

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {Snoway} client
     * @param {Discord.GuildMember} member
     * 
     */
    run: async (client, member) => {
        if(!member)return;
        try {
            const dbChannels = await client.db.get(`ghostjoin_${member.guild.id}`) || [];
            if (dbChannels.length > 0) {
                for (const channelId of dbChannels) {
                    const channel = member.guild.channels.cache.get(channelId);
                    if (channel && channel.isTextBased()) {
                        const message = await channel.send(`${member.user}`);
                        await sleep(2000); 
                        message.delete().catch(() => {}); 
                    }
                }
            }
        } catch {}
    }
};
