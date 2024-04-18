const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: 'resetbot',
    description: {
        fr: "supprime toutes les données du bot",
        en: "deletes all bot data"
    },

    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Array} args
     */
    run: async (client, message, args) => {
        if (!client.config.buyers.includes(message.author.id)) return;

        try {

            const buttonvalider = new Discord.ButtonBuilder()
                .setLabel('✅')
                .setCustomId('resetbot_valider_' + message.id)
                .setStyle(2)

            const buttonrefuser = new Discord.ButtonBuilder()
                .setLabel('❌')
                .setCustomId('resetbot_refuser_' + message.id)
                .setStyle(4)


            const row = new Discord.ActionRowBuilder()
                .addComponents(buttonvalider, buttonrefuser)

            const msg = await message.channel.send({ content: await client.lang('resetbot.message'), components: [row] });
            const collector = msg.createMessageComponentCollector();

            collector.on("collect", async (i) => {
                if (i.user.id !== message.author.id) {
                    if (i.user.id !== user.id) {
                        return i.reply({
                            content: await client.lang('interaction'),
                            flags: 64
                        })
                    }
                }

                if (i.customId === `resetbot_valider_${message.id}`) {
                    await client.db.deleteAll()
                    i.update({ content: await client.lang('resetbot.reset'), components: [] });
                }

                if (i.customId === `resetbot_refuser_${message.id}`) {
                    i.update({ content: await client.lang('resetbot.noreset'), components: [] });
                }
            });

        } catch (error) {
            message.channel.send(`${await client.lang('resetbot.erreur')} \`\`\`js\n${error.message}\`\`\``);
        }
    }
};