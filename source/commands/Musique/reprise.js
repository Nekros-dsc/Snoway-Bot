const { useQueue, useMainPlayer } = require("discord-player");
const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: "reprise",
    aliases: ['resume', "reprendre"],
    description: {
        fr: "Relance la musique.",
        en: "Play the music again."
    },
    /**
     *
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     * @returns
     */
    run: async (client, message, args) => {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply("> `❌` Erreur : Vous devez être dans un salon vocal");
        const queue = useQueue(message.guild.id);

        if (message.guild.members.me.voice.channelId !== channel.id)return message.reply({content: "> `❌` Erreur : Vous n'êtes pas dans ma vocal"})
        if (!queue || !queue.currentTrack) {
            return message.reply("Aucune musique n'est en lecture");
        }

        if (queue.node.isPlaying()) {
            return message.reply({ content: "Aucune musique n'est en lecture" });
        }

        queue.node.resume();
        return message.reply({ content: "La musique reprend donc, bonne écoute !" });
    }
}