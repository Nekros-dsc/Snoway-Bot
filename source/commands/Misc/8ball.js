const Discord = require('discord.js')
module.exports = {
    name: '8ball',
    description: {
      fr: "Pose une question au bot",
      en: "Ask the bot a question"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const responses = [
            "C'est certain.",
            "C'est décidément ainsi.",
            "Sans aucun doute.",
            "Oui, absolument.",
            "Tu peux compter dessus.",
            "Comme je le vois, oui.",
            "Probablement.",
            "Oui.",
            "Les signes pointent vers le oui.",
            "Mieux vaut ne pas te le dire maintenant.",
            "Je ne peux pas prédire maintenant.",
            "Ne compte pas là-dessus.",
            "Ma réponse est non.",
            "Mes sources disent non.",
            "D'après le wiki de google, non.",
            "Très douteux.",
            "._."
          ];
          const question= args.join(" ")
          if (!question) {
            return message.reply("> Demande moi quelle que chose");
          }
      
          const randomIndex = Math.floor(Math.random() * responses.length);
          const response = responses[randomIndex];
          message.reply(`${response}`);
    }
}