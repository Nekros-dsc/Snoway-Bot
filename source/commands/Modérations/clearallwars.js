const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearallwarns',
    description: {
        fr: 'Supprime tous les avertissements du serveur',
        en: "Removes all server warnings"
    },
    run: async (client, message, args) => {
        try {
            const warns = await client.db.get(`sanction_${message.guild.id}`) || [];

            if (warns.length === 0) {
                return message.channel.send('> `❌` Aucun avertissement trouvé sur le serveur.');
            }

            await client.db.delete(`sanction_${message.guild.id}`);

            message.channel.send('Tous les avertissements du serveur ont été supprimés avec succès.');
        } catch (err) {
            console.error('Erreur:', err);
            message.reply("Une erreur est survenue...");
        }
    }
};
