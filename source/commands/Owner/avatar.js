const Discord = require('discord.js');

module.exports = {
    name: 'setpic',
    aliases: ["setavatar", "avatar"],
    usage: {
        fr: {"setpic <image/lien>": "Définir l\'avatar du bot"},
        en: {"setpic <image/lien>": "Define the bot's avatar"}
    }, 
    description: {
        fr: "Définir l\'avatar du bot",
        en: "Define the bot's avatar"
    },
    run: async (client, message, args) => {
        let avatarURL;

        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            avatarURL = attachment.url;
        } else if (args[0]) {
            avatarURL = args[0];
        } else {
            return message.channel.send("Merci de fournir un nouvel avatar...");
        }

        try {
            await client.user.setAvatar(avatarURL);
            return message.channel.send("[J'ai bien changé ma photo de profil]" + `(<${avatarURL}>)`);
        } catch (error) {
            console.error('Erreur:', error);
            return message.channel.send("Une erreur vient de se produire...");
        }
    },
};
