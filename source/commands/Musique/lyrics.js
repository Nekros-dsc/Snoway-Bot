const Genius = require('genius-lyrics');
const { ActionRowBuilder, ButtonBuilder} = require('discord.js');
const Discord = require('discord.js')
const Snoway = require('../../structures/client/index')
const geniusClient = new Genius.Client("XD8nZ8yc-r4uP9mFskLRWx8cV0SP-Nlau9nx0R8i-LJdmEYjx9a-PSoTWJthDLpe");

module.exports = {
    name: "lyrics",
    description: {
        fr: "Rechercher les paroles d'un titre !",
        en: "Search for lyrics!"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        try {
            const query = args.join(' ');
            const searches = await geniusClient.songs.search(query);

            if (!searches.length) {
                return message.reply("Désolé, je n'ai pas trouvé votre titre");
            }

            const firstSong = searches[0];
            const lyrics = await firstSong.lyrics();

            if (lyrics.length > 2000) {
                const lyricsChunks = splitText(lyrics, 2000);
                let page = 0;

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('<<<')
                        .setStyle(1),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('>>>')
                        .setStyle(1)
                );

                const msg = await message.reply({
                    content: lyricsChunks[page],
                    components: [row],
                });

                const collector = msg.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async (interaction) => {
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({ content: "Tu n'as pas la permission d'intéragir avec cette interaction"});
                    }

                    if (interaction.customId === 'previous') {
                        page--;
                    } else if (interaction.customId === 'next') {
                        page++;
                    }

                    if (page < 0) {
                        page = 0;
                    } else if (page >= lyricsChunks.length) {
                        page = lyricsChunks.length - 1;
                    }

                    await interaction.deferUpdate();

                    msg.edit({
                        content: lyricsChunks[page],
                        components: [row],
                    });
                });

                collector.on('end', () => {
                    msg.edit({
                        components: [],
                    });
                });
            } else {
                message.reply({ content: lyrics});
            }
        } catch (error) {
            console.error('Erreur dans la commande lyrics :', error);
            message.reply('Une erreur s\'est produite.');
        }
    },
};

function splitText(text, length) {
    const chunks = [];
    let chunk = '';

    for (const line of text.split('\n')) {
        if (chunk.length + line.length + 1 <= length) {
            chunk += line + '\n';
        } else {
            chunks.push(chunk);
            chunk = line + '\n';
        }
    }

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
}
