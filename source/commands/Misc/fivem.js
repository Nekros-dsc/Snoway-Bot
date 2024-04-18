const {EmbedBuilder, Message} = require('discord.js');
const Snoway = require('../../structures/client');
module.exports = {
  name: 'fivem',
  description: {
    fr: "Connecte votre serveur FiveM.",
    en: "Connect your FiveM server."
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {
    if (args[0]) {
      if (args[0].toLowerCase() === "set") {
        const ips = args[1];
        if (!ips) return message.reply('Veuillez spécifier une adresse IP et un port valides.');
        const { ip, port } = check(ips);
        if (ip && port) {
          await client.db.set(`fivemip`, {
            ip: ip,
            port: port
          });
          return message.reply('Serveur FiveM set !');
        } else {
          return message.reply('Veuillez spécifier une adresse IP et un port valides.');
        }
      } else {
        const embedMessage = await embed(client);
        return message.reply({ embeds: [embedMessage] });
      }
    } else {
      const embedMessage = await embed(client);
      return message.reply({ embeds: [embedMessage] });
    }
  }
};

async function embed(client) {
  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setFooter(client.footer);

  try {
    const servData = (await client.functions.fivem.getAllPlayer()).serv;
    const serv = servData !== undefined ? servData : [];
     embed.setTitle(`Joueur connecté ${((await client.functions.fivem.getAllPlayer()).serv).length}/${(await client.functions.fivem.getPlayerMax()).max}`);
    let text = "";
    serv.forEach(player => {
      text += `**ID:** \`${player.id}\` | **Player:** \`${player.name}\` | **Ping:** \`${player.ping}ms\`\n`;
    });

    embed.setDescription(text);
  } catch (error) {
    console.log(error)
    embed.setDescription("Impossible à récupérer: adresse IP invalide ou serveur hors ligne.");
  }

  return embed;
}

function check(ip) {
  const words = ip.split(" ");
  for (const word of words) {
    if (word.includes(":")) {
      const [ip, port] = word.split(":");
      return { ip, port };
    }
  }
  return { ip: null, port: null };
}