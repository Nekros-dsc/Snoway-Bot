const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'ghostjoin',
    aliases: ["ghostping", "ghost"],
    description: {
        fr: "Permet de configurer les salons dans lequels un nouveau membre sera ping",
        en: "Allows you to configure the rooms in which a new member will be pinged"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const msg = await message.channel.send({
            content: "** **"
        })
        async function update() {
            const db = await client.db.get(`ghostjoin_${message.guild.id}`) || []
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTitle('Salons ghostjoin')
                .setDescription('```js\n'+ (db.map(channel => `${client.channels.cache.get(channel)?.name || "Inconnu"} (ID: ${client.channels.cache.get(channel)?.id || "Inconnu"})`).join('\n') || "Aucun") + '```');

            const channel = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ChannelSelectMenuBuilder()
                        .setCustomId('channel-ping')
                        .setPlaceholder('Ajouter/Retire un salon')
                        .setMinValues(1)
                        .setMaxValues(25)
                        .addChannelTypes(0)
                );

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('delete')
                        .setStyle(4)
                        .setEmoji(client.functions.emoji.del)
                )

            msg.edit({
                embeds: [embed],
                content: null,
                components: [channel, button]
            })
        }

        update()

        const collect = msg.createMessageComponentCollector()

        collect.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }
            
            await i.deferUpdate();
            switch (i.customId) {
                case "channel-ping":
                    const selectedChannels = i.values;
                    let dbChannels = await client.db.get(`ghostjoin_${message.guild.id}`) || [];
                        selectedChannels.forEach(channel => {
                        const index = dbChannels.indexOf(channel);
                        if (index !== -1) {
                            dbChannels.splice(index, 1);
                        } else {
                            dbChannels.push(channel);
                        }
                    });
                    
                    await client.db.set(`ghostjoin_${message.guild.id}`, dbChannels);
                    update();
                    break;

                case "delete":
                    await client.db.delete(`ghostjoin_${message.guild.id}`)
                    update()
                    break;
            }

        })
    }
}