const { useQueue, useMainPlayer } = require("discord-player");
const Discord = require('discord.js');
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "volume",
    description: {
        fr: "Modifie le volume de la musique en cours de lecture.",
        en: "Changes the volume of the music currently playing."
    },
    usage: {
        fr: {"volume <volume>": "Modifie le volume de la musique en cours de lecture."}, 
        en: {"volume <volume>": "Changes the volume of the music currently playing."}},
    /**
     * 
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     * @returns
     */
    run: async (client, message, args) => {
        const queue = useQueue(message.guild.id);
        const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer);

        if (!queue || !queue.currentTrack) {
            embed.setDescription("Il n'y a pas de musique en cours de lecture !");
            message.reply({ embeds: [embed] });
            return;
        }

        const volumeValue = parseFloat(args[0]);

        if (isNaN(volumeValue) || volumeValue < 1 || volumeValue > 100) {
            embed.setDescription("Merci de donner un chiffre entre 1 et 100 pour le volume.");
            message.reply({ embeds: [embed] });
            return;
        }

        const channel = message.member.voice.channel;

        if (!channel) {
            embed.setDescription("Vous n'êtes pas connecté à un salon vocal !");
            message.reply({ embeds: [embed] });
            return;
        }

        if (queue.channel.id !== channel.id) {
            embed.setDescription("Je joue déjà dans un autre salon vocal.");
            embed.setColor(client.color);
            message.reply({ embeds: [embed] });
            return;
        }

        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
            embed.setDescription("Je suis déjà dans un autre salon vocal.");
            message.reply({ embeds: [embed] });
            return;
        }

        queue.node.setVolume(volumeValue);

        embed.setDescription(`Volume réglé sur ${volumeValue}%`);
        embed.setColor(client.color);
        message.reply({ embeds: [embed] });
    }
};
