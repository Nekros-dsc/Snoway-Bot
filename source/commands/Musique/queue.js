const { useQueue, useMainPlayer } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "queue",
    aliases: ['mabite'],
    description: {
        fr: "Voir les musiques qui vont être jouées",
        en: "See the music to be played"
    },

    /**
     * @param {Snoway} client
     * @param {Snoway} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
        if (!queue || queue.tracks.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique en cours !");
            return message.reply({ embeds: [embed] });
        }
        const channel = message.member.voice.channel;

        if (!channel) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Vous n'êtes pas en vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (message.guild.members.me.voice.channelId && channel.id !== message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je suis déjà dans un autre salon vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (!message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique en cours de lecture !");
            return message.reply({ embeds: [embed] });
        }

        const itemPerPage = 5;
        const totalPages = Math.ceil((queue.tracks.data.length || 1) / itemPerPage);
        let currentPage = 1;
        const musiquencours = queue.currentTrack;

        const generateEmbed = (page) => {
            const startIndex = (page - 1) * itemPerPage;
            const endIndex = startIndex + itemPerPage;
            const tracks = queue.tracks.data.slice(startIndex, endIndex);

            const queueEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Queue")
                .setThumbnail(musiquencours.thumbnail.url || musiquencours.thumbnail)
                .addFields({ name: "Musique Actuelle", value: `[${musiquencours.title} - (${musiquencours.durationFormatted || musiquencours.duration})](${musiquencours.url})` });

            if (tracks.length > 0) {
                queueEmbed.addFields({ name: `Chansons en file d'attente (${queue.tracks.data.length})`, value: tracks.map((song, id) => `${startIndex + id + 1}. [${song.raw.title}](${song.url})`).join('\n') });
            } else {
                queueEmbed.addFields({ name: "Chansons en file d'attente", value: "Aucune autre musique" });
            }

            queueEmbed.setFooter({ text: `${client.footer.text} - Page ${page}/${totalPages}`, iconUrl: musiquencours.thumbnail });

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('<<<')
                    .setDisabled(page === 1)
                    .setStyle(page === 1 ? 2 : 1),
                new ButtonBuilder()
                    .setCustomId('page')
                    .setLabel(`${page}/${totalPages}`)
                    .setDisabled(true)
                    .setStyle(2), 
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('>>>')
                    .setDisabled(page === totalPages)
                    .setStyle(page === totalPages ? 2 : 1)
            );
        
            return { queueEmbed, row };
        };

        const { queueEmbed, row } = generateEmbed(currentPage);
        const embed = await message.reply({ embeds: [queueEmbed], components: [row] });

        const collector = embed.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                i.reply({ content: "Tu n'es pas autorisé à interagir avec cette interaction !"});
                return;
            }

            if (i.customId === 'previous') {
                if (currentPage === 1) return;
                currentPage--;
            } else if (i.customId === 'next') {
                if (currentPage === totalPages) return;
                currentPage++;
            }

            const { queueEmbed, row } = generateEmbed(currentPage);
            await i.update({ embeds: [queueEmbed], components: [row] });
        });
    }
};
