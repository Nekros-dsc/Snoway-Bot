const { useQueue } = require("discord-player");
const { MessageActionRow, MessageSelectMenu, StringSelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const Snoway = require('../../structures/client/index')
const { QueueRepeatMode } = require("discord-player");

module.exports = {
    name: "repeat",
    aliases: ['loop'],
    description: {
        fr: "Répéter la musique/queue ou désactiver le mode",
        en: "Repeat music/track or deactivate mode"
    },
    /**
     * @param {Snoway} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        try {
            const channel = message.member.voice.channel;
            if (!channel) return message.reply("> `❌` Erreur : Vous devez être dans un salon vocal");
            const queue = useQueue(message.guild.id);

            if (message.guild.members.me.voice.channelId !== channel.id)return message.reply({content: "> `❌` Erreur : Vous n'êtes pas dans ma vocal"})
            if (!queue || !queue.currentTrack) {
                return message.reply("Aucune musique n'est en lecture");
            }

            const options = [
                { label: "Song", value: "1" },
                { label: "Queue", value: "2" },
                { label: "Off", value: "3" },
            ];

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('repeat_menu')
                .setPlaceholder('Sélectionnez le mode de répétition')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await message.reply({
                content: "Choisissez le mode de répétition :",
                components: [row],
            });

            const filter = (interaction) => interaction.customId === 'repeat_menu';
            const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async (interaction) => {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "Vous n'êtes pas autorisé à utiliser cette interaction.",
                        flags: 64
                    })
                }
                const selectedValue = interaction.values[0];
                let response = "";

                switch (selectedValue) {
                    case "1":
                        queue.setRepeatMode(QueueRepeatMode.TRACK);
                        response = "La musique sera répétée !";
                        break;
                    case "2":
                        if (queue.tracks.data.length === 0) {
                            response = "Aucune musique dans la queue !";
                        } else {
                            queue.setRepeatMode(QueueRepeatMode.QUEUE);
                            response = "La file d'attente sera répétée !";
                        }
                        break;
                    case "3":
                        queue.setRepeatMode(QueueRepeatMode.OFF);
                        response = "Bien désactivé !";
                        break;
                    default:
                        response = "Option non valide sélectionnée.";
                        break;
                }

                interaction.update({ content: response, components: [] });
                collector.stop();
            });


        } catch (error) {
            console.error('Erreur dans la commande repeat :', error);
            message.reply('Une erreur s\'est produite.');
        }
    },
};
