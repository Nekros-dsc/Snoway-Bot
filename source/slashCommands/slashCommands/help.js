const Discord = require('discord.js');
const fs = require('fs');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: "help",
    description:  'Affiche les commandes du bot',
    description_localizations: {
        "fr": "Affiche les commandes du bot",
        "en-US": "Displays bot commands"
    },
    type: 1,
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
        const lang = await client.db.get(`langue`)
        const prefix = await client.db.get(`prefix_${interaction.guild.id}`) || client.config.prefix
        const aidetext = await client.lang('help.aide')
        const aide = aidetext.replace("{prefix}", `${prefix}`)

        const cmddanslefichier = fs.readdirSync('./source/commands').filter(folder => folder !== 'DEV');
            const module = await client.db.get(`module-help`) || 'normal'
            const fileEmojis = {
                Informations: '🔍',
                Buyers: '🔰',
                Modérations: '⚔',
                Contact: "✉",
                Utilitaires: '🛠',
                Permissions: "🎭",
                Musique: '🎶',
                Logs: '📁',
                Antiraid: '🛡',
                Owner: '🔑',
                Misc: '🎗',
            };

            if (module === 'normal') {
                let page = 0;

                const folderOrder = [
                    'Antiraid',
                    'Modérations',
                    'Informations',
                    'Utilitaires',
                    'Musique',
                    'Misc',
                    'Contact',
                    'Logs',
                    'Permissions',
                    'Owner',
                    'Buyers'
                ];

                const categoryOrder = {
                    'Antiraid': 1,
                    'Modérations': 2,
                    'Informations': 3,
                    'Utilitaires': 4,
                    'Musique': 5,
                    'Misc': 6,
                    'Contact': 7,
                    'Logs': 8,
                    'Permissions': 9,
                    'Owner': 10,
                    'Buyers': 11,
                    
                };

                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));

                const generetapage =  (pageactuellement) => {
                    const fichiertasoeur = cmddanslefichier[pageactuellement];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../../commands/${fichiertasoeur}/${file}`);
                        let usages = null;
                        let descriptions = null
                        if (command.usage) {
                            switch (lang) {
                                case "fr":
                                    usages = command.usage.fr;
                                    break;
                                case "en":
                                    usages = command.usage.en;
                                    break;
                                default:
                                    usages = command.usage.fr;
                            }
                        }

                        switch (lang) {
                            case "fr":
                                descriptions = command.description.fr;
                                break;
                            case "en":
                                descriptions = command.description?.en;
                                break;
                            default:
                                descriptions = command.description.fr;
                        }

                        const usage = usages || {
                            [command.name]: descriptions || "Error"
                        };

                        let description = '';
                        for (const [key, value] of Object.entries(usage)) {
                            description += `\n\`${prefix}${key}\`\n${value}`;
                        }

                        return description;
                    });

                    const embed = new Discord.EmbedBuilder()
                        .setColor(color)
                        .setTitle((fileEmojis[fichiertasoeur] || '❌') + " " + fichiertasoeur)
                        .setFooter(client.footer)
                        .setDescription(`${aide}\n` + categoryCommands.join(''));
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectMenu')
                                .setPlaceholder('Snoway')
                                .addOptions(
                                    folderOrder.map(folder => ({
                                        label: folder,
                                        value: folder,
                                        emoji: fileEmojis[folder] || "❌",
                                    }))
                                ),
                        );

                    const rows = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('page')
                                .setDisabled(true)
                                .setStyle(2)
                                .setLabel(`${categoryOrder[fichiertasoeur]}/${Object.keys(categoryOrder).length}`),
                        )

                    return { embeds: [embed], components: [row, rows] };
                };

                const { embeds, components } = generetapage(page);
                const helpMessage = await interaction.editReply({ embeds, components });

                const filter = i => i.customId === 'selectMenu';
                const collector = helpMessage.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({
                            content: await client.lang('interaction'),
                            flags: 64
                        })
                    }
                    const selectedFile = i.values[0];
                    const page = cmddanslefichier.indexOf(selectedFile);
                    const { embeds, components } = generetapage(page);
                    await i.update({ embeds, components });
                });

            }


            if (module === "onepage") {
                const formattedCategories = [];

                for (const folder of cmddanslefichier) {
                    const cmdfichier = fs.readdirSync(`./source/commands/${folder}`).filter(file => file.endsWith('.js'));
                    const catecmd = [];

                    for (const file of cmdfichier) {
                        const command = require(`../../commands/${folder}/${file}`);
                        catecmd.push(`${command.name}`);
                    }

                    formattedCategories.push(`**${fileEmojis[folder]}・${folder}**\n\`${catecmd.join('\`, \`') || await client.lang('help.nocmd')}\``);
                }

                const helptext = await client.lang('help.help')
                const text = helptext.replace("{prefix}", `${prefix}`)
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: "Snoway V3", url: client.user.avatarURL(), iconURL: client.user.avatarURL() })
                    .setDescription(`${await client.lang("help.prefix")} \`${prefix}\`\n${await client.lang("help.cmd")} \`${client.commands.size}\`\n${text}\n\n` + formattedCategories.join('\n\n'))
                    .setFooter(client.footer);

                interaction.editReply({ embeds: [embed] });
            }
        }
}