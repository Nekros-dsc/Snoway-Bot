const Snoway = require("../../structures/client");
const Discord = require('discord.js')
module.exports = {
  name: 'prefix',
  description: {
    fr:'Change le prefix du bot sur le serveur',
    en: "Change the prefix of the bot on the server"
  },
  usage: {
    fr:{"prefix <préfixe>": 'Change le prefix du bot sur le serveur'},
    en: {"prefix <prefix>": 'Change the prefix of the bot on the server'}
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @returns 
   */
  run: async (client, message, args) => {
    const newPrefix = args[0];
    const exPrefix = await client.db.get(`prefix_${message.guild.id}`)
    if (!newPrefix) {
      return message.channel.send(await client.lang('prefix.noperfix'));
    }

    if(newPrefix === exPrefix) {
      return message.channel.send(await client.lang('prefix.invalide'));

    }
    
    await client.db.set(`prefix_${message.guild.id}`, newPrefix)

    return message.channel.send(`${await client.lang('prefix.set')} \`${newPrefix}\``);
  },
};