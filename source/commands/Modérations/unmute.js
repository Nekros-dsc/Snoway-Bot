const Discord = require("discord.js");
const ms = require("../../structures/Utils/ms");

module.exports = {
    name: 'unmute',
    aliases: ["untimeout"],
    description: {
        fr: 'Permet de révoquer le timeout d\'un membre du serveur',
        en: 'Allows you to revoke the timeout of a server member'
    },
    usage: {
        fr: { "unmute <@user/ID> [raison]": "Permet de révoquer le timeout d'un membre du serveur" },
        en: { "unmute <@user/id> [reason]": "Allows you to revoke the timeout of a server member" }
    },

    run: async (client, message, args) => {
        try {
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!target) {
                return message.reply({ content: '> `❌` Erreur : Veuillez spécifiez un membre du serveur valide' });
            }

            await target.timeout(null);
            message.channel.send({ content: `${target} a de nouveau la permission de parler` });
        } catch (error) {
            console.error(error);
            message.channel.send({ content: "Une erreur viens de se produire" });
        }
    }
};
