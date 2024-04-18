const { useQueue } = require("discord-player");
const { EmbedBuilder, Message } = require('discord.js');
const Snoway = require('../../structures/client/index')
module.exports = {
    name: "skip",
    description: {
        fr: "Passe la musique actuelle",
        en: "Pass the current music",
    },
    /**
     * @param {Snoway} client
     * @param {Message} message
     */

    run: async (client, message) => {
        const queue = useQueue(message.guild.id);

        if (!queue || !queue.currentTrack) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Il n'y a pas de musique en cours de lecture");
            return message.reply({ embeds: [embed] });
        }

        if (queue && queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique après celle-ci !");
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

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Je suis déjà dans un autre salon vocal !");
            return message.reply({ embeds: [embed] });
        }

        if (!message.guild.members.me.voice) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription("Aucune musique lancée !");
            return message.reply({ embeds: [embed] });
        }

        queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setDescription("La musique a bien été passée je vous laisse profiter de la musique !");
        return message.reply({ embeds: [embed] });
    }
}
