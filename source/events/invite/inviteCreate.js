const Discord = require('discord.js');

module.exports = {
    name: 'inviteCreate',
    /**
     * 
     * @param {Discord.Invite} invite 
     */
    run: async (client, invite) => {
        const invitesData = client.invites;

        const guildId = invite.guild.id;
        const inviteCode = invite.code;
        const inviterId = invite.inviter ? invite.inviter.id : null;
        const uses = invite.uses;

        try {
            if (!invitesData.has(guildId)) {
                invitesData.set(guildId, new Map());
            }
            const guildInvites = invitesData.get(guildId);

            if (!guildInvites.has(inviterId)) {
                guildInvites.set(inviterId, []);
            }
            const inviterInvites = guildInvites.get(inviterId);

            inviterInvites.push({ code: inviteCode, uses: uses });
        } catch (error) {
            console.log('Erreur : ' + error);
        }
    }
};
