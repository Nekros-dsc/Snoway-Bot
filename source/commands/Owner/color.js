const { resolveColor, EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'color',
  aliases: ['theme'],
  description: {
    fr: "Change la couleur de l\'embed du bot sur le serveur",
    en: "Change the color of the bot's embed on the server"
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {*} message 
   * @param {*} args 
   * @returns 
   */
  run: async (client, message, args) => {
   
    
    if (!args[0]) return message.channel.send(`Utilisation correct \`${client.prefix}color <color>\``);

    const colorMap = {
      "rouge": "#FF0000",
      "vert": "#00FF00",
      "bleu": "#0000FF",
      "noir": "#000000",
      "blanc": "#FFFFFF",
      "rose": "#dc14eb",
      "violet": "#764686",
      "sown": "#e1adff",
      "orange": "#FFA500",
      "jaune": "#FFFF00",
      "marron": "#A52A2A",
      "gris": "#808080",
      "argent": "#C0C0C0",
      "cyan": "#00FFFF",
      "lavande": "#E6E6FA",
      "corail": "#FF7F50",
      "beige": "#F5F5DC",
      "defaut": client.config.color
    }

    const colorArg = args[0].toLowerCase();

    if (colorArg in colorMap) {
      const embed = new EmbedBuilder()
      .setFooter(client.footer)
      .setTitle("TEST COULEUR")
        .setColor(colorMap[colorArg]);

      client.db.set(`color_${message.guild.id}`, colorMap[colorArg]);
      return message.channel.send({ content: `Je viens de chnager pour: \`${colorArg}\`.`, embeds: [embed] });
    } else {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (colorRegex.test(colorArg)) {
        const resolvedColor = resolveColor(colorArg);
        if (resolvedColor !== null) {
          const embed = new EmbedBuilder()
            .setFooter(client.footer)
            .setTitle("TEST COULEUR")
            .setColor(resolvedColor);

          client.db.set(`color_${message.guild.id}`, resolvedColor);
          return message.channel.send({ content: `Je viens de chnager pour: \`${colorArg}\`.`, embeds: [embed] });
        }
      }

      return message.channel.send(`Couleur invalide...`);
    }
  }
}
