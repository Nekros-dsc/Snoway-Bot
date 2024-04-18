const { useQueue, useMainPlayer } = require("discord-player");
const Discord = require('discord.js');
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "playlist",
    description: "Crée/delete/list,play vos playlists",
    usage: {
        fr: {
            "playlist create <nom>": "Crée une playlist",
            "playlist play <nom>": "Joue vos musiques préférées",
            "playlist add <nom_playlist> <song>": "Ajoute un song de la playlist",
            "playlist del <nom_playlist> <song>": "Supprime un song de la playlist",
            "playlist list": "Affiche la liste de vos playlists",
            "playlist delete <nom>": "Supprime une playlist"
        }, en: {
            "playlist create <name>": "Creates a playlist",
            "playlist play <name>": "Plays your favorite music",
            "playlist add <playlist_name> <song>": "Adds a song from the playlist",
            "playlist del <playlist_name> <song>": "Deletes a song from the playlist",
            "playlist list": "Displays the list of your playlists",
            "playlist delete <name>": "Deletes a playlist"
        }
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        try {
            const subCommand = args[0];

            switch (subCommand) {
                case 'delete':
                    const playlistToDelete = args[1];
                    const playlists = await client.db.get(`playlist_${message.author.id}`) || [];
                    const indexToDelete = playlists.findIndex(playlist => playlist.name === playlistToDelete);

                    if (indexToDelete !== -1) {
                        playlists.splice(indexToDelete, 1);
                        await client.db.set(`playlist_${message.author.id}`, playlists);
                        message.reply(`La playlist \`${playlistToDelete}\` supprimée avec succès.`);
                    } else {
                        message.reply(`Aucune playlist trouvé.`);
                    }
                    break;

                case 'create':
                    const playlistName = args[1];
                    if(!playlistName) return;
                    const db = await client.db.get(`playlist_${message.author.id}`) || [];
                    const verif = db.find(playlist => playlist.name === playlistName);
                    if (db.length >= 25) {
                        return message.reply("Vous avez déjà atteint le nombre maximal de playlists. Merci d'en supprimer pour en créer une nouvelle.");
                    }
                    
                    
                    if (verif) {
                        return message.reply('Une playlist existe déjà avec ce nom.');
                    }

                    const newPlaylist = {
                        name: playlistName,
                        musique: [],
                        create: Date.now(),
                        edit: Date.now()
                    };

                    db.push(newPlaylist);
                    await client.db.set(`playlist_${message.author.id}`, db);

                    message.reply(`La playlist ${playlistName} à bien été crée !`);
                    break;

                case 'list':
                    const userPlaylists = await client.db.get(`playlist_${message.author.id}`) || [];
                    if (userPlaylists.length === 0) {
                        return message.reply("Vous n'avez aucune playlist.");
                    }

                    const itemsPerPage = 5;
                    const totalPages = Math.ceil(userPlaylists.length / itemsPerPage);
                    let page = 1;
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const playlistsSlice = userPlaylists.slice(startIndex, endIndex);
                    const playlistsMap = playlistsSlice.map((playlist) => {
                        const musiqueplaylist = playlist.musique.length
                        const createDate = new Date(playlist.create);
                        const editDate = new Date(playlist.edit);
                        const formattedDateEdit = `${editDate.getDate()}/${editDate.getMonth() + 1}/${editDate.getFullYear()}`;
                        const formaDateEdit = `${editDate.getHours().toString().padStart(2, '0')}:${editDate.getMinutes().toString().padStart(2, '0')}:${editDate.getSeconds().toString().padStart(2, '0')}`
                        const formattedDate = `${createDate.getDate()}/${createDate.getMonth() + 1}/${createDate.getFullYear()}`;
                        const formaDate = `${createDate.getHours().toString().padStart(2, '0')}:${createDate.getMinutes().toString().padStart(2, '0')}:${createDate.getSeconds().toString().padStart(2, '0')}`
                        return `__**Playlist**__ \`${playlist.name}\` \`\`\`js\nMusique${musiqueplaylist < 1 ? "s" : ""}: ${musiqueplaylist}\nCréée ${formattedDate} [${formaDate}]\nModifier: ${formattedDateEdit} [${formaDateEdit}]\`\`\``;
                    }).join('\n');

                    const embed = new Discord.EmbedBuilder()
                        .setColor(client.color)
                        .setFooter({ text: `${client.footer.text} • Page ${page}/${totalPages}` })
                        .setDescription(playlistsMap)
                        .setTitle("Liste de vos playlists");

                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('<<<')
                                .setStyle(1)
                                .setDisabled(page === 1),
                            new Discord.ButtonBuilder()
                                .setCustomId('lists')
                                .setLabel(`${page}/${totalPages}`)
                                .setStyle(2)
                                .setDisabled(page === 1),
                            new Discord.ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('>>>')
                                .setStyle(1)
                                .setDisabled(page === totalPages)
                        );

                    const reply = await message.reply({ embeds: [embed], components: [row]});

                    const collector = reply.createMessageComponentCollector({ time: 180000 });

                    collector.on('collect', async (button) => {
                        if (button.user.id !== message.author.id) {
                            return button.reply({
                                content: "Vous n'êtes pas autorisé à utiliser cette interaction.",
                                ephemeral: true
                            });
                        }

                        if (button.customId === 'next' && page < totalPages) {
                            page++;
                        } else if (button.customId === 'previous' && page > 1) {
                            page--;
                        }

                        const updatedEmbed = new Discord.EmbedBuilder()
                            .setColor(client.color)
                            .setFooter({ text: `${client.footer.text} • Page ${page}/${totalPages}` })
                            .setDescription(playlistsMap)
                            .setTitle("Liste de vos playlists");

                        const updatedRow = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('previous')
                                    .setLabel('<<<')
                                    .setStyle(1)
                                    .setDisabled(page === 1),
                                new Discord.ButtonBuilder()
                                    .setCustomId('lists')
                                    .setLabel(`${page}/${totalPages}`)
                                    .setStyle(2)
                                    .setDisabled(page === 1),
                                new Discord.ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('>>>')
                                    .setStyle(1)
                                    .setDisabled(page === totalPages)
                            );

                        await button.update({ embeds: [updatedEmbed], components: [updatedRow] });
                    });

                    collector.on('end', () => {
                        reply.edit({ components: [] });
                    });
                    break;

                    case 'add':
                        const playlistNameToAdd = args[1];
                        const songToAdd = args.slice(2).join(" "); 
                        
                        if (!playlistNameToAdd || !songToAdd) {
                            return message.reply("Utilisation invalide. Utilisation correcte: `playlist add <nom_playlist> <song>`");
                        }
                    
                        const playlistsToAdd = await client.db.get(`playlist_${message.author.id}`) || [];
                        const playlistToAdd = playlistsToAdd.find(playlist => playlist.name === playlistNameToAdd);
                    
                        if (!playlistToAdd) {
                            return message.reply("Playlist non trouvée.");
                        }
                    
                        if (playlistToAdd.musique.includes(songToAdd)) {
                            return message.reply("La chanson existe déjà dans la playlist.");
                        }
                    
                        playlistToAdd.musique.push(songToAdd);
                        playlistToAdd.edit = Date.now(); 
                    
                        await client.db.set(`playlist_${message.author.id}`, playlistsToAdd);
                    
                        message.reply(`La chanson \`${songToAdd}\` a été ajoutée à la playlist \`${playlistNameToAdd}\`.`);
                        break;
                    
                default:
                    message.reply(`Utilisation invalide, \`${client.prefix}help playlist\`.`);
                    break;

            }
        } catch (error) {
            console.error('Erreur dans la commande playlist :', error);
            message.reply('Une erreur s\'est produite.');
        }
    }
};
