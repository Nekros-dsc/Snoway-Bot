const Discord = require('discord.js');

module.exports = {
    name: 'inviteDelete',
    /**
     * 
     * @param {Discord.Invite} invite 
     */
    run: async (client, invite) => {
        const invitesData = client.invites;

        const guildId = invite.guild.id;
        const inviteCode = invite.code;

        try {
            if (invitesData.has(guildId)) {
                const guildInvites = invitesData.get(guildId);
                guildInvites.forEach((inviterInvites, inviterId) => {
                    const index = inviterInvites.findIndex(inv => inv.code === inviteCode);
                    if (index !== -1) {
                        inviterInvites.splice(index, 1);
                    }
                });
            }
        } catch (error) {
            console.log('Erreur : ' + error);
        }
    }
};
