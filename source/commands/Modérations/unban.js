const Discord = require('discord.js');
const ms = require('../../structures/Utils/ms'); ;

module.exports = {
    name: "unban",
    description: {
        fr: "Permet de débannir l'utilisateur indiqué",
        en: "Allows you to troubleshoot the specified user"
    },
    usages: {
        fr: {"unban <id>": "Permet de révoquer le ban d'un utilisateur du serveur"},
        en: {"unban <id>": "Allows you to troubleshoot the specified user"}
    },
    run: async (client, message, args) => {
        let user = args[0];
        if (!user) return message.channel.send("Veuillez spécifier un ID d'utilisateur valide.");

        let bannedUser;
        bannedUser = await client.users.fetch(user);

        message.guild.members.unban(bannedUser).then(async () => {
            await message.channel.send(`**${bannedUser.tag}** vient d'être débanni(e) du discord`);
        }).catch(async () => {
            await message.channel.send(`<@${user}> n'est pas banni`);
        });
    }
};