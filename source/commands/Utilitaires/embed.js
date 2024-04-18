const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Message, ButtonBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index')
const Discord = require('discord.js')

module.exports = {
    name: 'embed',
    aliases: ["createembed", "embedbuilder", "builder"],
    description: {
        fr: "Permet de créer un embed personnalisé",
        en: "Create a custom embed"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription('** **');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('options')
                    .addOptions([
                        {
                            label: 'Modifier le titre',
                            emoji: "✏",
                            value: 'titre',
                        },
                        {
                            label: 'Modifier la description',
                            emoji: "💭",
                            value: 'description',
                        },
                        {
                            label: 'Modifier la couleur',
                            emoji: "⚫",
                            value: 'color',
                        },
                        {
                            label: 'Modifier l\'image',
                            emoji: "🖼",
                            value: 'image',
                        },
                        {
                            label: 'Modifier le thumbnail',
                            emoji: "🗺",
                            value: 'thumbnail',
                        },
                        {
                            label: 'Modifier l\'auteur',
                            emoji: "✂",
                            value: 'auteur',
                        },
                        {
                            label: 'Modifier le footer',
                            emoji: "🔻",
                            value: 'footer',
                        },
                        {
                            label: 'Copier un embed',
                            emoji: "💉",
                            value: 'copy',
                        },
                    ]),
            );

        const rowButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yep')
                    .setDisabled(false)
                    .setStyle(2)
                    .setLabel('✅ Valider'),
                new ButtonBuilder()
                    .setCustomId('nop')
                    .setDisabled(false)
                    .setStyle(4)
                    .setLabel('❌ Annuler'),
            )
        const msg = await message.channel.send({ content: `**Panel de création d'embeds de ${message.guild.name}**`, embeds: [embed], components: [row, rowButton] });

        const collector = msg.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    content: await client.lang('interaction'),
                    flags: 64
                })
            }

            if (i.customId === 'options') {
                await i.deferUpdate();

                const option = i.values[0];
                switch (option) {
                    case 'titre':
                        const replyTitle = await msg.reply('Merci de me donner le nouveau titre de l\'embed');
                        const responseTitle = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        responseTitle.on('collect', async m => {
                            const title = m.content.trim();
                            if (title.length > 256) {
                                await message.reply('Vous ne pouvez pas mettre plus de 256 caractères.');
                                await m.delete().catch(() => { });
                                await replyTitle.delete().catch(() => { });
                                responseTitle.stop();
                                return;
                            }
                            if (title) {
                                embed.setTitle(title);
                                await msg.edit({ embeds: [embed] });
                            } else {
                                await message.channel.send('Erreur: Titre non valide.');
                            }

                            await m.delete().catch(() => { });
                            await replyTitle.delete().catch(() => { });
                            responseTitle.stop();
                        });
                        break;


                    case 'description':
                        const replyDescription = await msg.reply('Entrez la nouvelle description de l\'embed :');
                        const responseDescription = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        responseDescription.on('collect', async m => {
                            const description = m.content.trim();
                            if (description.length > 4096) {
                                await message.reply('Vous ne pouvez pas mettre plus de 4096 caractères.');
                                await m.delete().catch(() => { });
                                await replyDescription.delete().catch(() => { });
                                responseDescription.stop();
                                return;
                            }
                            if (description) {
                                embed.setDescription(description);
                                await msg.edit({ embeds: [embed] });
                            } else {
                                await message.channel.send('Erreur: Titre non valide.');
                            }

                            await m.delete().catch(() => { });
                            await replyDescription.delete().catch(() => { });
                            responseDescription.stop();
                        });
                        break;
                    case 'color':
                        const reply = await msg.reply('Merci de me donner la nouvelle couleur de l\'embeds');
                        const responseCollector = message.channel.createMessageCollector();

                        responseCollector.on('collect', async m => {
                            const color = m.content.trim();
                            if (await client.functions.bot.color(color)) {
                                embed.setColor(await client.functions.bot.color(color));
                                await msg.edit({ embeds: [embed] });
                            } else {
                                await message.channel.send('Couleur invalide. Assurez-vous que la couleur est en format hexadécimal (ex: #ff0000).');
                            }

                            await m.delete().catch(() => { });
                            await reply.delete().catch(() => { });
                            responseCollector.stop();
                        });
                        break;
                    case 'image':
                        const replyImage = await msg.reply('Merci de me donner le lien de la nouvelle image de l\'embed');
                        const responseImage = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        responseImage.on('collect', async m => {
                            const imageUrl = m.attachments.first()?.url;
                            if (imageUrl) {
                                embed.setImage(imageUrl);
                                await msg.edit({ embeds: [embed] });
                            } else {
                                await message.channel.send('Erreur: Lien de l\'image non valide.');
                                responseImage.stop();
                                await m.delete().catch(() => { });
                                await replyImage.delete().catch(() => { });
                                return;
                            }

                            await m.delete().catch(() => { });
                            await replyImage.delete().catch(() => { });
                            responseImage.stop();
                        });
                        break;
                    case 'thumbnail':
                        const replyThumbnail = await msg.reply('Merci de me donner le lien du nouveau thumbnail de l\'embed');
                        const responseThumbnail = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        responseThumbnail.on('collect', async m => {
                            const thumbnailUrl = m.attachments.first()?.url;
                            if (thumbnailUrl) {
                                embed.setThumbnail(thumbnailUrl);
                                await msg.edit({ embeds: [embed] });
                            } else {
                                await message.channel.send('Erreur: Lien du thumbnail non valide.');
                                await m.delete().catch(() => { });
                                await replyThumbnail.delete().catch(() => { });
                                responseThumbnail.stop();
                                return;
                            }

                            await m.delete().catch(() => { });
                            await replyThumbnail.delete().catch(() => { });
                            responseThumbnail.stop();
                        });
                        break;

                    case 'auteur':
                        const replyAskName = await msg.reply('Merci de me donner le nom de l\'auteur de l\'embed. Si vous ne souhaitez pas ajouter d\'auteur, répondez \`non\`.');
                        const responseName = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        let authorName = '';

                        responseName.on('collect', async m => {
                            const nameResponse = m.content.trim();
                            if (nameResponse.toLowerCase() === 'non') {
                                await replyAskName.delete().catch(() => { });
                                await m.delete().catch(() => { });
                                responseName.stop();
                                return;
                            } else {
                                authorName = nameResponse;
                                await replyAskName.delete().catch(() => { });
                                await m.delete().catch(() => { });
                                responseName.stop();

                                const replyAskURL = await msg.reply('Merci de me donner l\'URL de l\'auteur de l\'embed. Si vous ne souhaitez pas ajouter d\'auteur, répondez \`non\`.');
                                const responseURL = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                                responseURL.on('collect', async m => {
                                    const urlResponse = m.content.trim();
                                    if (urlResponse.toLowerCase() === 'non') {
                                        await replyAskURL.delete().catch(() => { });
                                        await m.delete().catch(() => { });
                                        responseURL.stop();
                                        embed.setAuthor({ name: authorName });
                                        await msg.edit({ embeds: [embed] });
                                        return;
                                    } else {
                                        const attachment = m.attachments.first();
                                        const imageURL = attachment ? attachment.url : null;
                                        if (!imageURL) {
                                            await message.channel.send('URL invalide. Veuillez fournir une URL valide ou répondre avec \`non\` pour annuler.');
                                            return;
                                        }
                                        embed.setAuthor({ name: authorName, iconURL: imageURL });
                                        await msg.edit({ embeds: [embed] });

                                        await replyAskURL.delete().catch(() => { });
                                        await m.delete().catch(() => { });
                                        responseURL.stop();
                                    }
                                });
                            }
                        });

                        break;
                    case 'footer':
                        const ez = await msg.reply("Quel texte voulez-vous ajouter au footer de cet embed ?");

                        const textCollector = message.channel.createMessageCollector({
                            filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 120000
                        });

                        textCollector.on('collect', async (collectedText) => {
                            const footerText = collectedText.content.trim();
                            collectedText.delete();
                            textCollector.stop();

                            if (!footerText) {
                                message.channel.send("Vous n'avez pas fourni de texte pour le footer.");
                                return;
                            }

                            if (footerText.toLowerCase() === 'non') {
                                embed.setFooter(footerText);
                                await msg.edit({ embeds: [embed] });
                                return;
                            }

                            const ez2 = await msg.reply("Si vous souhaitez également ajouter une image au footer, veuillez envoyer l'image maintenant. Sinon, répondez avec `non`.");

                            const imageCollector = message.channel.createMessageCollector({
                                filter: m => m.author.id === message.author.id,
                                max: 1,
                                time: 120000
                            });

                            imageCollector.on('collect', async (collectedImage) => {
                                const attachment = collectedImage.attachments.first();
                                const imageURL = attachment ? attachment.url : null;

                                embed.setFooter({
                                    text: footerText,
                                    iconURL: imageURL
                                });

                                collectedImage.delete();
                                imageCollector.stop();

                                await msg.edit({ embeds: [embed] });
                            });

                            imageCollector.on('end', (collected, reason) => {
                                if (reason === 'time') {
                                    message.channel.send("Temps écoulé. La commande a été annulée.");
                                }
                                ez2.delete().catch(() => { });
                            });
                            ez.delete().catch(() => { });
                        });

                        textCollector.on('end', (collected, reason) => {
                            if (reason === 'time') {
                                message.channel.send("Temps écoulé. La commande a été annulée.");
                            }
                            ez.delete().catch(() => { });
                        });
                        break;

                    case 'copy':
                        const copyRequest = await msg.reply("Merci de fournir l'ID du message contenant l'embed que vous souhaitez copier.");

                        const copyCollector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });

                        copyCollector.on('collect', async m => {
                            const messageID = m.content.trim();

                            const targetMessage = await message.channel.messages.fetch(messageID).catch(() => { });

                            if (!targetMessage) {
                                await message.channel.send("Le message avec cet ID n'a pas été trouvé. Veuillez vérifier l'ID et réessayer.");
                                return;
                            }

                            const lastEmbed = targetMessage?.embeds[0];

                            if (lastEmbed) {
                                const embedCopy = new Discord.EmbedBuilder(lastEmbed);

                                await msg.edit({ embeds: [embedCopy] });
                                await copyRequest.delete();
                                await m.delete();
                            } else {
                                await message.channel.send("Aucun embed n'a été trouvé dans le message spécifié.");
                            }
                            copyCollector.stop();
                        });

                        copyCollector.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                await message.channel.send("La demande a expiré. Veuillez réessayer.");
                                await copyRequest.delete();
                            }
                        });

                        break;

                    default:

                        break;
                }
            }


            switch (i.customId) {
                case "yep":
                    const channel = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ChannelSelectMenuBuilder()
                                .setCustomId('channel-send')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addChannelTypes(0)
                        );
            
                    i.update({ components: [channel], content: "Merci de choisir un channel où l'embed sera envoyé." });
                    break;
                case "nop":
                    i.message.delete().catch(() => {});
                    break;

                    case "channel-send": 
                    i.deferUpdate();
                    const channeltosend = client.channels.cache.get(i.values[0]);
                    const embeds = i.message.embeds;
                    if (embeds && embeds.length > 0) {
                        const embedToSend = embeds[0];
                        channeltosend.send({
                            embeds: [embedToSend]
                        }).then(() => {
                            msg.edit({
                                content: `L'embed vient d'être envoyé`,
                                components: []
                            });
                        }).catch(error => {
                            console.error("Une erreur s'est produite:", error);
                        });
                    } else {
                        console.error("Aucun embed trouvé dans le message d'origine.");
                    }
                break;
            }
        });
    },
};
