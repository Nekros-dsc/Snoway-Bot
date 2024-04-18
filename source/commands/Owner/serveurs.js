const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'servers',
    aliases: ['server', 'servers'],
    description: {
        fr: "Affiche la liste des serveurs sur lesquels le bot est présent",
        en: "Displays the list of servers on which the bot is present"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message
     * 
     **/
    run: async (client, message) => {
        const msg = await message.channel.send({content: await client.lang('server.start')})
        const guilds = client.guilds.cache.filter(guild => guild.id !== client.functions.config.private);
        const guildInvites = await Promise.all(guilds.map(async (guild) => {
            const invite = await guild.channels.cache.find(ch => ch.type === 0)?.createInvite({
                maxAge: 0,
                maxUses: 0,
            }).catch(() => {})
            return `[\`${guild.name}\`](${invite ? invite.url : client.support}) (\`${guild.id}\`) | [${guild.memberCount}]`;

        }));


        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(await client.lang('server.embed.title'))
            .setDescription(`${await client.lang('server.embed.description')}\n` + guildInvites.join('\n'))
            .setFooter({ text: client.footer.text + ` | ${client.prefix}leave <guild id>` });

        await msg.edit({ embeds: [embed], content: null });
    },
};



