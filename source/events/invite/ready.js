const ms = require('ms');
const Discord = require('discord.js');

module.exports = {
    name: 'ready',
    /**
     * 
     * @param {import("../../structures/client")} client 
     */
    run: async (client) => {
        const invitesData = client.invites;

        client.guilds.cache.forEach(async guild => {
            try {
                const invites = await guild.invites.fetch();
                invites.forEach(invite => {
                    if (invite.inviterId) {
                        const guildId = guild.id;
                        const inviteCode = invite.code;
                        const inviterId = invite.inviterId;
                        const uses = invite.uses; 
                        
                        if (!invitesData.has(guildId)) {
                            invitesData.set(guildId, new Map());
                        }
                        const guildInvites = invitesData.get(guildId);

                        if (!guildInvites.has(inviterId)) {
                            guildInvites.set(inviterId, []);
                        }
                        const inviterInvites = guildInvites.get(inviterId);

                        inviterInvites.push({ code: inviteCode, uses: uses });
                    }
                });
            } catch (error) {
                console.log('Erreur : ' + error);
            }

            if (guild.features.includes('VANITY_URL')) {
                try {
                    const vanity = await guild.fetchVanityData();
                    client.vanityURL.set(guild.id, {url: vanity.code, uses: vanity.uses});
                } catch (error) {
                    console.log('Erreur: ' + guild.id + ' : ' + error);
                }
            }
        });
    }
};