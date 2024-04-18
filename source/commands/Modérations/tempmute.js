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
  name: 'tempmute',
  aliases: ["timeout"],
  description: {
    fr: 'Permet de mute temporairement un membre du serveur',
    en: "Allows you to temporarily mute a server member"
  },
  usage: {
    fr: {"tempmute <utilisateur/id> <temps> [raison]": "Permet de mute temporairement un membre du serveur"},
    en: {"tempmute <user/id> <time> [reason]": "Allows you to temporarily mute a server member"}
  },
  run: async (client, message, args) => {
    try {
      const tempmuteMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!tempmuteMember) return message.reply({ content: "Veuillez indiquer un membre"});

      const duration = args[1];
      if (!duration) return message.channel.send("> `❌` Erreur : Usage: `.tempmute @user time (s/m/h/d)`");
      
      if (!ms(duration)) return message.channel.send(await client.lang('tempmute.invalidetemps'));
      if (ms(duration) > 2419200000) return message.channel.send("> `❌`Erreur : Temps incorrecte");

      if (!duration.endsWith("s") && !duration.endsWith("h") && !duration.endsWith("d") && !duration.endsWith("m")) return message.channel.send("> `❌`Erreur : La durée du mute n'est pas correcte :*\n> Jours : `d`\n> Heures : `h`\n> Minutes : `m`\n> Secondes : `s`");

      const reason = args.slice(2).join(" ");
      
      if (tempmuteMember.id === message.guild.ownerId) {
        return message.reply('> `❌` Erreur : Vous ne pouvez tempmute le propriétaire du serveur');
      }

      if (!tempmuteMember || !message.guild.members.cache.has(tempmuteMember.id)) {
        return message.channel.send("Le membre n'est trouvée");
      }

      await tempmuteMember.timeout(ms(duration), reason);
      await message.channel.send({ content: `${tempmuteMember.user} à été **tempmute ${duration}** pour \`${reason}\`` });

      setTimeout(async () => {
        message.channel.send({ content: `\`${tempmuteMember.user.username}\` a été **untempmute**` });
      }, ms(duration));

    } catch (error) {
      if (error.code === 50013) {
        message.reply("> `❌` Erreur : Je ne peux pas tempmute ce membre");
        return;
      }
      message.channel.send("Une erreur vient de se produire ;..;");
    }
  }
};
