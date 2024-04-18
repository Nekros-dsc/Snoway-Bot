const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')

module.exports = {
    name: 'logs',
    description: {
        fr: "Permet d'afficher le statut des salons logs",
        en: "Displays the status of salon logs"
    },
    /**
     *
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        const logs = await client.db.get(`logs_${message.guild.id}`) || [
            { roles: null },
            { voice: null },
            { message: null },
            { mod: null },
            { raid: null },
            { channel: null },
            { boost: null },
            { flux: null }
        ]

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setTitle(`Logs de ${message.guild.name}`)
            .addFields(
                { name: "Logs messages", value: getChannelName(logs, 'message'), inline: true },
                { name: "Logs vocal", value: getChannelName(logs, 'voice'), inline: true },
                { name: "Logs rôles", value: getChannelName(logs, 'roles'), inline: true },
                { name: "Logs mods", value: getChannelName(logs, 'mod'), inline: true },
                { name: "Logs raid", value: getChannelName(logs, 'raid'), inline: true },
                { name: "Logs salon", value: getChannelName(logs, 'channel'), inline: true },
                { name: "Logs boosts", value: getChannelName(logs, 'boost'), inline: true },
                { name: "Logs flux", value: getChannelName(logs, 'flux'), inline: true }
            )

        return message.channel.send({
            content: null,
            embeds: [embed]
        })

        function getChannelName(logs, type) {
            const log = logs.find(obj => obj.hasOwnProperty(type));
            return `\`\`\`js\n${log && log[type] ? client.channels.cache.get(log[type]).name : "Aucun"}\`\`\``;
        }
    },
};
