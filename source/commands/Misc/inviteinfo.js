const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')

module.exports = {
    name: 'inviteinfo',
    description: {
        fr: 'Affiche les informations d\'une invitation personnalisée !',
        en: "Display personalized invitation information!"
    },
    usage: {
        fr: {'inviteinfo <url>': "Affiche les informations d\'une invitation personnalisée !"},
        en: {'inviteinfo <url>': "Display personalized invitation information!"}
    },
    /**
* 
* @param {Snoway} client 
* @param {Discord.Message} message 
* @param {string[]} args 
*/
    run: async (client, message, args) => {
        const url = args[0]
        try {
            const invite = await client.fetchInvite(url);
            if(!invite) return message.reply('Erreur, serveur invalide');
            const server = invite.guild;
            const embed = new Discord.EmbedBuilder()
                .setTitle(server.name)
                .setColor(0x6200b8)
                .setDescription(server.description || 'Aucune description disponible')
                .setThumbnail(server.iconURL())
                .addFields({ name: 'Nombre de membres', value: `\`${invite.memberCount.toLocaleString()} membres\``, inline: false })
                .addFields({ name: 'Nombre de membres en ligne', value: `\`${invite.presenceCount.toLocaleString()} membres\``, inline: false })
                .addFields({ name: 'Nombre de boosts', value: `\`${server.premiumSubscriptionCount.toString()} boost\``, inline: false })
                .addFields({ name: 'Vérification level', value: `**niveau** \`${server.verificationLevel}\``, inline: false })
                .addFields({ name: 'Date de création', value: `<t:${Math.round(server.createdAt / 1000)}:F> (<t:${Math.round(server.createdAt / 1000)}:R>)`, inline: false })
                .setFooter(client.footer);
            if (server.bannerURL() && server.iconURL()) {
                embed.setImage(server.bannerURL({ dynamic: true, size: 4096 }))
            }
            await message.reply({ embeds: [embed] });

        } catch (error) {
            await message.reply('Erreur, serveur invalide');
            console.log('Erreur, serveur invalide');
        }



    },
};