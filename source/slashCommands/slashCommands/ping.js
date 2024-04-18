const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'ping',
  description: "Affiche la latence du bot",
  description_localizations: {
    "fr": "Affiche la latence du bot", 
    "en-US": "Displays bot latency"
},
  type: "1",
  /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Interaction} interaction 
   * @param {string[]} args 
   */
  run: async (client, interaction) => {
    const start = Date.now()
    await interaction.deferReply({ ephemeral: true });
    interaction.editReply({ content: "ping..." });
    const fin = Date.now()
    const time = fin - start
    interaction.editReply({ content: `API: **${client.ws.ping}ms**\nBot: **${time}ms**` });
  }
}