const Discord = require('discord.js');
const axios = require('axios');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'osu',
    description: {
        fr: "Envoie les informations du profil osu! d\'un joueur.",
        en: "Sends a player's osu! d\'profile information."
    },
    usage: {
        fr: {"osu <@user/id>": "Envoie les informations du profil osu! d'un joueur"},
        en: {"osu <@user/id>": "Sends a player's osu! d\'profile information."}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!args.length) {
            return message.reply('Veuillez fournir le nom d\'utilisateur osu!');
        }

        const username = args.join(' ');

        try {
            const response = await axios.get(`https://osu.ppy.sh/api/get_user?k=35b2e1806edeed1011fc4b63f001a441e088cdee&u=${encodeURIComponent(username)}`);
            if (response.data.length === 0 || !response.data) return message.reply('Veuillez fournir le nom d\'utilisateur valide');
            console.log(response.data[0])
            const userData = response.data[0];
            const date = new Date(userData.join_date).getTime()
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${userData.username}'s osu Profile`)
                .setColor(client.color)
                .addFields({ name: 'User ID', value: `${userData.user_id}` })
                .addFields({ name: 'Total Score', value: `${userData.total_score || "Aucun Score"}` })
                .addFields({ name: 'PP Rank', value: `${userData.pp_rank || "Aucun Score"}` })
                .addFields({ name: 'Région', value: `${userData.country || "Aucun Région"}` })
                .addFields({ name: 'Level', value: `${userData.level || "Aucun level"}` })
                .addFields({ name: 'Création du compte', value: `<t:${date / 1000}:F> (<t:${date / 1000}:R>)` })


            message.channel.send({
                embeds: [embed]
            });
        } catch (error) {
            console.error(error);
            message.reply('Une erreur s\'est produite.');
        }
    }
};
