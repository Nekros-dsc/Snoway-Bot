
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {Snoway} client
     * @param {Snoway} member
     */
    run: async (client, member) => {
        const dbserveur = await client?.db.get(`ticket_${member.guild.id}`)
        if(!dbserveur)return;
        try {
            const tickeruser = await client.db.get(`ticket_user_${member.guild.id}`) || [];

            const userTickets = tickeruser.filter(ticket => ticket.author === member.id);

            for (const ticket of userTickets) {
                const channel = member.guild.channels.cache.get(ticket.salon);
                if (channel) {
                    await channel.delete();
                }
            }
            
            const updatedTickets = tickeruser.filter(ticket => ticket.author !== member.id);
            await client.db.set(`ticket_user_${member.guild.id}`, updatedTickets);
        } catch (error) {
            console.error(error);
        }
    }
}