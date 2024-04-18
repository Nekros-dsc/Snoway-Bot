const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: "name",
    description: {
        fr: "Permet de changer le nom du bot",
        en: "Change bot name"
    },
    usage: {
        fr: {"name <new_name>": "Permet de changer le nom du bot"},
        en: {"name <new_name>": "Change bot name"}
    },
    run: async (client, message, args) => {
        let name = args.join(" ");

        if (!name) return;
        if (name.length > 32) return message.channel.send(`${await client.lang('name.long')}`);
        if (name.length < 2) return message.channel.send(`${await client.lang('name.court')}`);

        client.user.setUsername(name);
        message.channel.send(`${await client.lang('name.set')} ` + `${name}`);
    }
};
