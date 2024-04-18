const Discord = require('discord.js');

module.exports = {
    name: 'unbanall',
    description: {
        fr: 'Unbanall tous les utilisateurs bannis.',
        en: "Unbanall all banned users."
    },
    run: async (client, message, commandName) => {
        const bans = await message.guild.bans.fetch();

        if (bans.size === 0) {
            return message.reply({ content: "Il n'y a aucun membre banni.", allowedMentions: { repliedUser: false } });
        }

        const unbanall = [];

        try {
            bans.forEach(async (ban) => {
                const user = ban.user;
                unbanall.push({ id: user.id}); 
                await message.guild.bans.remove(user.id);
            });

            client.db.set(`unbanall_${message.guild.id}`, unbanall);

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**${bans.size}** membres ont été débannis avec succès. Utilisez \`${client.prefix}cancelunbanall\` pour annuler.`)
                .setFooter(client.footer)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply(await client.lang('erreur'));
        }
    }
};