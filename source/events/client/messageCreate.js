const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'messageCreate',
  /**
   * 
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @returns 
   */
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return;
    const prefix = await client.db.get(`prefix_${message.guild.id}`) || client.config.prefix
    client.color = await client.db.get(`color_${message.guild.id}`) || client.config.color
    client.prefix = await client.db.get(`prefix_${message.guild.id}`) || client.config.prefix
    client.noperm = "Tu n'as pas la permission d'utiliser cette commande."


    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      return message.channel.send(`${await client.lang('prefixbot')} \`${prefix}\``).catch(() => { });
    }

    if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
      if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) {
        return;
      }
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

    const commandName = args.shift()?.toLowerCase().normalize();
    if (!commandName) return;

    const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!cmd) return;
    if(cmd.category === "DEV" && !client.dev.includes(message.author.id)) return;
    const name = cmd.name;
    const owners = await client.db.get(`owner`) || [];

    const permBot = client.dev.includes(message.author.id) || client.config.buyers.includes(message.author.id) || owners.includes(message.author.id);

    if (!permBot) {
      const permissionIndex = await client.db.get(`perms_${message.guild.id}`);
      if (permissionIndex) {
        for (const perm in permissionIndex) {
          if (perm === 'public' && permissionIndex[perm]?.commands.includes(name) || (message.member.roles.cache.some(r => permissionIndex[perm].role?.includes(r.id)) && permissionIndex[perm]?.commands.includes(name))) {
            return cmd.run(client, message, args);
          }
        }
      }

      if (client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
      }
    }


    return cmd.run(client, message, args);
  }
};