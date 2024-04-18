const Snoway = require("../../structures/client");
const Discord = require('discord.js');
const ms = require('../../structures/Utils/ms'); 
module.exports = {
    name: 'soutien',
    description: {
        fr: 'Permet de donner automatiquement un rôle aux membres ayant un message dans leurs statuts',
        en: 'Automatically assigns a role to members with a message in their status'
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const db = await client.db.get(`soutien_${message.guild.id}`) || {
            status: false,
            role: null,
            vanity: null
        };

        const { embed, row } = await update();
        const reply = await message.channel.send({ embeds: [embed], components: [row] });


        const collector = reply.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if(i.user.id !== message.author.id) {
                return i.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }
            try {
                const interactionValue = i.values[0];

                 if (interactionValue === 'state') {
                    db.status = !db.status;
                    await client.db.set(`soutien_${message.guild.id}`, db);
                    const { embed: updatedEmbed, row: updatedRow } = await update();
                    await i.update({ embeds: [updatedEmbed], components: [updatedRow] });
                } else if (interactionValue === 'role') {
                    const filter = response => response.author.id === message.author.id;
                    const sentMessage = await i.reply(await client.lang('soutien.newrole'));

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const content = collected.first().content.trim();
                        const roleId = content.replace(/[<@&>]/g, '');
                        const role = message.guild.roles.cache.get(roleId);

                        if (role) {
                            db.role = role.id;
                            client.db.set(`soutien_${message.guild.id}`, db);
                            sentMessage.delete();
                            collected.first().delete();
                            const { embed: updatedEmbed, row: updatedRow } = await update();
                            await reply.edit({ embeds: [updatedEmbed], components: [updatedRow] });
                        } else {
                            message.channel.send(await client.lang('soutien.norole'));
                        }
                    } catch (error) {
                        console.log(error);
                        message.channel.send(await client.lang('soutien.noreponse'));
                    }

                } else if (interactionValue === 'vanity') {
                    const filter = response => response.author.id === message.author.id;
                    const sentMessage = await i.reply(await client.lang('soutien.newstatus'));

                    try {
                        const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                        const msg = collected.first().content.trim();
                        db.vanity = msg;
                        client.db.set(`soutien_${message.guild.id}`, db);
                        sentMessage.delete();
                        collected.first().delete();
                        const { embed: updatedEmbed, row: updatedRow } = await update();
                        return await reply.edit({ embeds: [updatedEmbed], components: [updatedRow] });
                    } catch (error) {
                        console.log(error)
                        message.channel.send(await client.lang('soutien.noreponse'));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });



        async function update() {
            const role = message.guild.roles.cache.get(db.role);
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTitle(await client.lang('soutien.embed.title'))
                .addFields(
                    { name: await client.lang('soutien.embed.status'), value: db.status ? "\`✅\`" : "\`❌\`" },
                    { name: await client.lang('soutien.embed.role'), value: role ? `${role} | \`${role.id}\`` : `\`${await client.lang('soutien.embed.noconfig')}\`` },
                    { name: await client.lang('soutien.embed.vanity'), value: db.vanity ? `\`${db.vanity}\`` : `\`${await client.lang('soutien.embed.noconfig')}\`` }
                );

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('soutien')
                        .addOptions([
                            {
                                label: await client.lang('soutien.select.status'),
                                value: "state",
                                emoji: "✅"
                            },
                            {
                                label: await client.lang('soutien.select.role'),
                                value: "role",
                                emoji: "📥"
                            },
                            {
                                label: await client.lang('soutien.select.vanity'),
                                value: "vanity",
                                emoji: "🧷"
                            },

                        ])
                );

            return { embed, row };
        }
    },
};
