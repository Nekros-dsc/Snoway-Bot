const Snoway = require("../../structures/client");

module.exports = {
    name: 'cancelunbanall',
    description: {
        fr: 'Annule l\'unbanall de tous les bans.',
        en: "Cancels the unbanall of all banns."
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Snoway} message 
     * @returns 
     */
    run: async (client, message) => {
        const unbanall = await client.db.get(`unbanall_${message.guild.id}`);

        if (!unbanall || unbanall.length === 0) {
            return message.reply({ content: "Aucun ban n'a été annulé.", allowedMentions: { repliedUser: false } });
        }
        try {
            unbanall.forEach(async (user) => {
                await message.guild.members.ban(user.id).catch((e) => { console.error(e)})
            });

            await client.db.delete(`unbanall_${message.guild.id}`);

            return message.reply({ content: "L'annulation des bans a été annulée avec succès.", allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply("Une erreur viens de se produire...");
        }
    }
};