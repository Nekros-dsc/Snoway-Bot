const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
  name: 'public',
  description: {
    fr: "Permet d'activer les commandes public sur le serveur !",
    en: "Enable public commands on the server!"
  },
  usage: {
    fr: {
      "public <on/off>": "Permet d'activer les commandes public sur le serveur !",
    }, en: {
      "public <on/off>": "Enable public commands on the server!",
    }
  },
  /**
   * @param {Snoway} client
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply('Veuillez spécifier `on` pour activer ou `off` pour désactiver les commandes publiques.');
    }

    const verif = args[0].toLowerCase();
    if (verif !== 'on' && verif !== 'off') {
      return message.reply('Veuillez spécifier `on` pour activer ou `off` pour désactiver les commandes publiques.');
    }

    const db = await client.db.get(`perms_${message.guild.id}`);
    if (!db) {
      return message.reply('Les permissions ne sont pas initialisées. Veuillez d\'abord initialiser les permissions avec la commande correspondante.');
    }

    switch (verif) {
      case 'on':
        if (db.public.status === true) return message.reply('Les commandes sont déjà activées !');
        db.public.status = true;
        await client.db.set(`perms_${message.guild.id}`, db);
        break;
      case 'off':
        if (db.public.status === false) return message.reply('Les commandes sont déjà désactivées !');
        db.public.status = false;
        await client.db.set(`perms_${message.guild.id}`, db);
        break;
    }

    message.reply(`Les commandes publiques sont maintenant ${verif === 'on' ? 'activées' : 'désactivées'}.`);
  }
};
