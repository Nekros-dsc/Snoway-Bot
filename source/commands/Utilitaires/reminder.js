const Discord = require('discord.js');
const ms = require('../../structures/Utils/ms'); 

module.exports = {
  name: 'reminder',
  description: {
    fr: 'Créer un rappel',
    en: 'Create a reminder',
  },
  usage: {
    fr: {
      "reminder <temps> <rappelle>":"Créer un rappel",
    }, 
    en: {
      "reminder <time> <reminder>":"Create a reminder",
    }
  },
  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @returns {void}
   */
  run: async (client, message, args) => {
    const time = args[0];
    const reminderText = args.slice(1).join(' ');

    if (!time || isNaN(ms(time))) {
      return message.reply(await client.lang('remid.temps'));
    }

    const userId = message.author.id;
    const userReminders = await client.db.get(`reminders`) || [];
    const reminderTime = ms(time);

    const newReminder = {
      user: message.author.id,
      reminder: reminderText,
      id: generateUniqueId(), 
      time: Date.now() + reminderTime,
    };

    userReminders.push(newReminder);

    await client.db.set(`reminders`, userReminders);

    message.reply(`${await client.lang('remid.set')} ${ms(reminderTime, { long: true })}.`);
  },
};

function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const idLength = 16;
    let result = '';
    for (let i = 0; i < idLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }