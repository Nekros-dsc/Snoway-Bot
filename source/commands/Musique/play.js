const { QueryType, useMainPlayer, useQueue } = require("discord-player");
const regex = /(https?:\/\/(?:www\.)?(?:open\.spotify|deezer|soundcloud|music\.apple)\.[a-z\.]+\/[^\s]+)/g;
const Discord = require('discord.js');
const Snoway = require('../../structures/client/index')
module.exports = {
    name: "play",
    aliases: ['p'],
    description: {
        fr: "Permet de lancer une musique",
        en: "Play music"
    },
    usage: {fr: {"play <musique>": "Permet de lancer une musique"}, en: {"play <song>": "Play music"}},
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {args[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const player = useMainPlayer();
        const queue = useQueue(message.guild.id);
        const channel = message.member.voice.channel;
        const query = args.join(" ");

        const checkPermission = (permission, errorMessage) => {
            if (!channel[permission]) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setDescription(errorMessage);
                return message.channel.send({ embeds: [embed] });
            }
            return true;
        };

        if (!channel || !checkPermission('viewable', "Vous n'êtes pas dans un channel vocal !") ||
            !checkPermission('joinable', "Je n'ai pas la permission de rejoindre le salon") ||
            (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId &&
                !checkPermission('full', "Ce salon vocal est plein !"))) {
            return;
        }

        let ez = QueryType.YOUTUBE;
        const matches = query.match(regex);
        if (matches) ez = QueryType.AUTO;

        try {
            const searchResult = await player.search(query, {
                requestedBy: message.user,
                searchEngine: ez
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Je recherche votre musique`)
                .setFooter(client.footer);

            const messageEmbed = await message.channel.send({ embeds: [embed] });

            const song = await player.play(channel, searchResult, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel,
                        client: message.guild.members.me,
                        requestedBy: message.user,
                    },
                    selfDeaf: true,
                    volume: 50,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000,
                },
            });

            const embedResponse = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Ajouté à la file d'attente - Position #${song.queue.tracks.data.length + 1}`)
            .setThumbnail(song.track.thumbnail)
            .addFields(
                { name: "Durée", value: `\`${song.track.duration}\``, inline: true },
                { name: "Demandé par", value: `<@${message.author.id}>`, inline: true},
                { name: "Auteur", value: `\`${song.track.author}\``, inline: true}
            )
            .setFooter(client.footer)
            .setDescription(`[${song.track.title}](${song.track.url})`);
    

            await messageEmbed.edit({ embeds: [embedResponse]});
        } catch (error) {
            if (error.message.includes(`No results found for "[object Object]"`)) {
                const embedError = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setDescription("Désolé mais je n'ai pas trouvé votre titre..");
                message.channel.send({ embeds: [embedError] });
            } else {
                console.error(error);
            }
        }
    }
};
