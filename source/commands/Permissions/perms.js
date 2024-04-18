const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'perms',
  description: {
    fr: "Permet d'afficher la liste des permissions du bot, ajouter ou retirer permissions sur les rôles",
    en: "Display list of bot permissions, add or remove permissions on roles"
  },
  /**
   * @param {Snoway} client 
   * @param {Discord.Message} message 
   * @param {Array} args 
   * @returns {void}
   */
  run: async (client, message, args) => {
    const permissions = await client.db.get(`perms_${message.guild.id}`);
    const embed = new Discord.EmbedBuilder()
      .setTitle('Permissions')
      .setColor(client.color);

    for (let i = 1; i <= 9; i++) {
      const permnames = `perm${i}`;
      const permission = permissions[permnames];
      const roolenannanana = permission.role ? `<@&${permission.role}>` : 'Aucun rôle';

      embed.addFields({name:`Permission ${i}`, value: `${roolenannanana}`, inline: true});
    }

    const publicperm = permissions.public;
    const publicstatus = publicperm.status ? `✅` : '❌';
    
    embed.addFields({name:'Permission Publique', value: `\`${publicstatus}\``});

    message.channel.send({ embeds: [embed] });
  }
};
