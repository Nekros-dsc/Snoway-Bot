const Discord = require("discord.js");
const ms = require("../../structures/Utils/ms");

getNow = () => {
  return {
    time: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }),
  };
};

module.exports = {
  name: 'mute',
  description: {
    fr: 'Permet de rendre muet un utilisateur du serveur',
    en: "Mute a server user"
  },
  usage: {
    fr: {"mute <@user/ID> [raison]": "Permet de rendre muet un utilisateur du serveur"},
    en: {"mute <@user/ID> [reason]": "Mute a server user"}
  },
  run: async (client, message, args) => {
    try {
      const tempmuteMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!tempmuteMember) return message.reply({ content: "Veuillez indiquer un membre"});
      
      const reason = args.slice(2).join(" ");
      
      if (tempmuteMember.id === message.guild.ownerId) {
        return message.reply('> `❌` Erreur : Vous ne pouvez mute le propriétaire du serveur');
      }

      if (!tempmuteMember || !message.guild.members.cache.has(tempmuteMember.id)) {
        return message.channel.send("Le membre n'est trouvée");
      }

      await tempmuteMember.timeout(ms("28d"), reason);
      await message.channel.send({ content: `${tempmuteMember.user} a été **timeout**` });

    } catch (error) {
      if (error.code === 50013) {
        message.reply("> `❌` Erreur : Je ne peux pas tempmute ce membre");
        return;
      }
      message.channel.send("Une erreur vient de se produire ;..;");

    }
  }
};
