const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'mybot',
    description:  'Affiche vos bots',
    description_localizations: {
        "fr": "Affiche vos bots", 
        "en-US": "Display your bots"
    },
    type: 1,
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @param {string[]} args 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
        const response = (await client.functions.api.botget(interaction.user.id)).bots || []
        if (response.length === 0) {
            return interaction.editReply({ content: await client.lang('mybot.aucun') });
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle(await client.lang('mybot.embed.title'))
            .setColor(color)
            .setFooter(client.footer);
            let description = ""
          
        for (let index = 0; index < response.length; index++) {
            const bot = response[index];

            const botUser = await client.users.fetch(bot.bot);


            description += `**${index + 1})** [\`${botUser ? botUser.tag : `${await client.lang('mybot.nobot')}`}\`](https://discord.com/api/oauth2/authorize?client_id=${botUser.id}&permissions=8&scope=bot%20applications.commands): <t:${Math.floor(bot.temps / 1000)}:R> ${bot.buyer ? "(buyer)" : ""}\n`;
        }

        embed.setDescription(description);
        interaction.editReply({ embeds: [embed] });
    },
};
