const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Snoway} client 
     * @param {Guild} guild 
     */
    run: async (client, member) => {
        const blacklist = await client.db.get('blacklist') || [];
        if (blacklist.some(entry => entry.userId === member.id)) {
            try {
                await member.ban({ reason: 'BLACKLIST' });
            } catch (error) {
                console.error(error);
            }
        }
    }
}