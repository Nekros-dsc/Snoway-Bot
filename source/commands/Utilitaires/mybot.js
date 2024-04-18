const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'mybot',
    aliases: ["mybots", "bot", "bots"],
    description: {
        fr: 'Affiche vos bots',
        en: "Display your bots"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const response = (await client.functions.api.botget(message.author.id)).bots || []
        if (response.length === 0) {
            return message.reply({ content: await client.lang('mybot.aucun') });
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle(await client.lang('mybot.embed.title'))
            .setColor(client.color)
            .setFooter(client.footer);
            let description = ""
          
        for (let index = 0; index < response.length; index++) {
            const bot = response[index];

            const botUser = await client.users.fetch(bot.bot);


            description += `**${index + 1})** [\`${botUser ? botUser.tag : `${await client.lang('mybot.nobot')}`}\`](https://discord.com/api/oauth2/authorize?client_id=${botUser.id}&permissions=8&scope=bot%20applications.commands): <t:${Math.floor(bot.temps / 1000)}:R> ${bot.buyer ? "(buyer)" : ""}\n`;
        }

        embed.setDescription(description);
        message.channel.send({ embeds: [embed] });
    },
};
