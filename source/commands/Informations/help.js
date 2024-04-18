const Discord = require('discord.js');
const fs = require('fs');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: "help",
    description: {
        fr: "Affiche les commandes du bot",
        en: "Displays bot commands"
    },
    usage: {
        fr: {
            "help [commande]": "Affiche les commandes ou une commande du bot"
        }, en: {
            "help [command]": "Displays commands or a bot command"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const lang = await client.db.get(`langue`)
        const aidetext = await client.lang('help.aide')
        const aide = aidetext.replace("{prefix}", `${client.prefix}`)
        if (args.length === 0) {
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


            if (module === "hybride") {
                const totalpag = cmddanslefichier.length;
                let page = 0;

                if (args.length > 0 && !isNaN(args[0])) {
                    page = parseInt(args[0]) - 1;
                    if (page < 0) page = 0;
                    if (page >= totalpag) page = totalpag - 1;
                }


                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));

                const generetapage = (pageactuellement) => {
                    const fichiertasoeur = cmddanslefichier[pageactuellement];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../${fichiertasoeur}/${file}`);
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
                            description += `\n\`${client.prefix}${key}\`\n${value}`;
                        }

                        return description;
                    });

                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
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
                const helpMessage = await message.channel.send({ embeds, components });

                const filter = i => i.customId === 'selectMenu';
                const collector = helpMessage.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
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

            if (module === 'normal') {
                const totalpag = cmddanslefichier.length;
                let page = 0;

                if (args.length > 0 && !isNaN(args[0])) {
                    page = parseInt(args[0]) - 1;
                    if (page < 0) page = 0;
                    if (page >= totalpag) page = totalpag - 1;
                }


                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));

                const generetapage = (pageactuellement) => {
                    const fichiertasoeur = cmddanslefichier[pageactuellement];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../${fichiertasoeur}/${file}`);
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
                            description += `\n\`${client.prefix}${key}\`\n${value}`;
                        }

                        return description;
                    });

                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
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
                const helpMessage = await message.channel.send({ embeds, components });

                const filter = i => i.customId === 'selectMenu';
                const collector = helpMessage.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
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

            if (module === 'button') {
                const totalpag = cmddanslefichier.length;
                let page = 0;
            
                if (args.length > 0 && !isNaN(args[0])) {
                    page = parseInt(args[0]) - 1;
                    if (page < 0) page = 0;
                    if (page >= totalpag) page = totalpag - 1;
                }
            
                cmddanslefichier.sort((a, b) => folderOrder.indexOf(a) - folderOrder.indexOf(b));
            
                const generetapage = (pageIndex) => {
                    const fichiertasoeur = cmddanslefichier[pageIndex];
                    const cmdFiles = fs.readdirSync(`./source/commands/${fichiertasoeur}`).filter(file => file.endsWith('.js'));
                    const categoryCommands = cmdFiles.map(file => {
                        const command = require(`../${fichiertasoeur}/${file}`);
                        let usages = null;
                        let descriptions = null;
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
                            description += `\n\`${client.prefix}${key}\`\n${value}`;
                        }
            
                        return description;
                    });
            
                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setTitle((fileEmojis[fichiertasoeur] || '❌') + " " + fichiertasoeur)
                        .setFooter(client.footer)
                        .setDescription(`${aide}\n` + categoryCommands.join(''));
            
                    const rows = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('presedant')
                                .setDisabled(pageIndex === 0)
                                .setStyle(2)
                                .setLabel(`<<<`),
                            new Discord.ButtonBuilder()
                                .setCustomId('page')
                                .setDisabled(true)
                                .setStyle(2)
                                .setLabel(`${categoryOrder[fichiertasoeur]}/${Object.keys(categoryOrder).length}`),
                            new Discord.ButtonBuilder()
                                .setCustomId('suivant')
                                .setStyle(2)
                                .setDisabled(pageIndex === totalpag - 1)
                                .setLabel(`>>>`),
                        );
            
                    return { embeds: [embed], components: [rows] };
                };
            
                const { embeds, components } = generetapage(page);
                const helpMessage = await message.channel.send({ embeds, components });
            
                const collector = helpMessage.createMessageComponentCollector();
            
                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({
                            content: await client.lang('interaction'),
                            flags: 64
                        });
                    }
            
                    let newPage = page;
                    if (i.customId === 'suivant') {
                        newPage++;
                    } else if (i.customId === 'presedant' && page > 0) {
                        newPage--;
                    }
                    console.log(cmddanslefichier.indexOf(newPage))
                    const pageIndex = cmddanslefichier.indexOf(newPage);
            
                    const { embeds, components } = generetapage(pageIndex);
                    await i.update({ embeds, components });
                    await i.deferUpdate(); 
                });
            }
            

            if (module === "onepage") {
                const formattedCategories = [];

                for (const folder of cmddanslefichier) {
                    const cmdfichier = fs.readdirSync(`./source/commands/${folder}`).filter(file => file.endsWith('.js'));
                    const catecmd = [];

                    for (const file of cmdfichier) {
                        const command = require(`../${folder}/${file}`);
                        catecmd.push(`${command.name}`);
                    }

                    formattedCategories.push(`**${fileEmojis[folder]}・${folder}**\n\`${catecmd.join('\`, \`') || await client.lang('help.nocmd')}\``);
                }

                const helptext = await client.lang('help.help')
                const text = helptext.replace("{prefix}", `${client.prefix}`)
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: "Snoway V3", url: client.user.avatarURL(), iconURL: client.user.avatarURL() })
                    .setDescription(`${await client.lang("help.prefix")} \`${client.prefix}\`\n${await client.lang("help.cmd")} \`${client.commands.size}\`\n${text}\n\n` + formattedCategories.join('\n\n'))
                    .setFooter(client.footer);

                message.channel.send({ embeds: [embed] });
            }
        }
        if (args.length !== 0) {
            const cmdname = args[0]
            const command = client.commands.get(cmdname) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdname));
            if (!command) {
                const noexiste = await client.lang('help.inconnue')
                const replay = noexiste.replace("{prefix}", `${client.prefix}`)
                return message.reply(replay);
            }
            let usages = null
            let description = null
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
                    description = command.description.fr;
                    break;
                case "en":
                    description = command.description.en;
                    break;
                default:
                    description = command.description.fr;
            }

            const usage = usages || {
                [command.name]: description || await client.lang('help.description')
            };
            const fields = [];

            for (const [key, value] of Object.entries(usage)) {
                fields.push({ name: "`" + client.prefix + key + "`", value: value, inline: false });
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${await client.lang('help.command')} ${client.functions.bot.maj(command.name)}`)
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(fields);
            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setStyle(5)
                        .setURL(client.support)
                        .setLabel(await client.lang('help.button'))
                )
            message.channel.send({ embeds: [embed], components: [row] });
        }
    }
}