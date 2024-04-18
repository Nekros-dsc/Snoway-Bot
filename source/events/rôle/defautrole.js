const Discord = require("discord.js");
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {Snoway} client
     * 
     */
    run: async (client, member) => {
        if(!member)return;
        const db = await client.db.get(`defautrole_${member.guild.id}`) || { roles: [] };
        for (const roleId of db.roles) {
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                member.roles.add(role).catch(e => { });
            }
        }
    }
}