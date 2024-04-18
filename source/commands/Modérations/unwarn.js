const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearwarns',
    description: {
        fr: 'Supprime tous les avertissements d\'un utilisateur',
        en: "Remove all warnings from a user"
    },
    run: async (client, message, args) => {
        try {
            const memberId = args[0];
            const warns = await client.db.get(`sanction_${message.guild.id}`) || [];

            if (!memberId) {
                return message.channel.send(`> \`❌\` Erreur : Usage: \`${client.prefix}clearwarns <Mention/ID>\``);
            }

            const userWarns = warns.filter(warn => warn.userId === memberId);

            if (userWarns.length === 0) {
                return message.channel.send('> \`❌\` Erreur : Aucun avertissement trouvé pour cet utilisateur.');
            }

            const remainingWarns = warns.filter(warn => warn.userId !== memberId);

            await client.db.set(`sanction_${message.guild.id}`, remainingWarns);

            message.channel.send(`Tous les avertissements pour l'utilisateur avec l'ID \`${memberId}\` ont été supprimés avec succès.`);
        } catch (err) {
            console.error('Erreur:', err);
            message.reply("Une erreur est survenue...");
        }
    }
};
