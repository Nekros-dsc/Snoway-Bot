const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')
module.exports = {
    name: 'presetlogs',
    description: {
        fr: "Automatically creates a lounge for each type of log. If a category is specified, lounges will be created in that category.",
        en: "Crèe automatiquement un salon pour chaque type de logs, si une catégorie est précisée les salons seront creés dedans"
    },
    /**
     *
     * @param {Snoway} client
     * @param {Message} message
     */
    run: async (client, message) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yep')
                    .setStyle(2)
                    .setDisabled(false)
                    .setLabel('✅'),
                new ButtonBuilder()
                    .setCustomId('nop')
                    .setStyle(2)
                    .setDisabled(false)
                    .setLabel('❌')
            )

        const msg = await message.reply({
            content: "Voulez vous créer un salon pour chaque type de logs ?",
            components: [row]
        })

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                if (i.user.id !== user.id) {
                    return i.reply({
                        content: await client.lang('interaction'),
                        flags: 64
                    })
                }
            }

            if (i.customId === "nop") {
                i.message.delete().catch(() => { })

            } else if (i.customId === "yep") {
                const msg = await i.update({
                    content: 'Je crée les salons',
                    components: []
                })
                let category = await message.guild.channels.create({
                    name: 'Espace Logs',
                    type: 4,
                    permissionOverwrites: [{
                        id: message.guild.roles.everyone.id,
                        allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    }]
                })

                let channelInfo = [
                    { name: '📁・raid', dbKey: 'raid' },
                    { name: '📁・rôles', dbKey: 'roles' },
                    { name: '📁・voice', dbKey: 'voice' },
                    { name: '📁・msg', dbKey: 'message' },
                    { name: '📁・mods', dbKey: 'mod' },
                    { name: '📁・channel', dbKey: 'channel' },
                    { name: '📁・boost', dbKey: 'boost' },
                    { name: '📁・flux', dbKey: 'flux' },
                ];

                let dbArray = [];

                for (let i = 0; i < channelInfo.length; i++) {
                    let channel = await message.guild.channels.create({
                        name: channelInfo[i].name,
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [{
                            id: message.guild.roles.everyone.id,
                            allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ReadMessageHistory],
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        }]
                    })

                    let data = {};
                    data[channelInfo[i].dbKey] = channel.id;
                    dbArray.push(data);
                }

                await client.db.set(`logs_${message.guild.id}`, dbArray);
                msg.edit({
                    content: `Création Terminée <@${message.author.id}>`,
                    components: []
                })
            }
        })
    },
};