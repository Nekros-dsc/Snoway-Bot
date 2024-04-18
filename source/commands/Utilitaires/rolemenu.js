const Snoway = require("../../structures/client")
const Discord = require('discord.js');

module.exports = {
    name: 'rolemenu',
    description: {
        fr: "Permet de créer des boutons rôles, l'utilisateur les utilises pour obtenir un rôle",
        en: "Creates role buttons, which the user uses to obtain a role"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {


        async function update(msgID) {
            const database = await client.db.get(`rolemenu_${message.guild.id}`) || [];
            const db = database.find(dbEntry => dbEntry.messageId === msgID) || { messageId: null, channel: null, option: [] };

            const embed = new Discord.EmbedBuilder()
            .setTitle('Paramètre du rôle menu')
            .setColor(client.color)
            .setFooter(client.footer)
            .addFields(
                {name: "Channel", value: `\`\`\`js\n${client.channels.cache.get(db.channel)?.name ? `${client.channels.cache.get(db.channel).name} (${client.channels.cache.get(db.channel).id})` : "Inconnue"}\`\`\``}
            )

            message.channel.send({embeds: [embed]})
        }


        update()
    }
}