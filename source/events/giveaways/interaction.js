const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;

        const { customId, user } = interaction;
        const giveawayEntryRegex = /^giveaway_entry_/;

        if (customId.match(giveawayEntryRegex)) {
            const giveawayCode = customId.split('_')[2];

            const giveawayData = await client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                if (!giveawayData.participant.includes(user.id)) {
                    giveawayData.participant.push(user.id);
                   await client.db.set(`giveaway_${interaction.guildId}_${giveawayCode}`, giveawayData);
                    interaction.reply({ content: "Vous participez maintenant au giveaway !", ephemeral: true });
                } else {
                    const leaveButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`giveaway_leave_${giveawayCode}`)
                                .setLabel("Quitter")
                                .setStyle(ButtonStyle.Danger)
                        );

                    interaction.reply({
                        content: "Vous participez déjà à ce giveaway.",
                        ephemeral: true,
                        components: [leaveButton]
                    });
                }
            }
        }

        if (customId.startsWith('giveaway_list_')) {
            const giveawayCode = customId.split('_')[2];
            const giveawayData = await client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                const participants = giveawayData.participant;
                if (participants.length > 0) {
                    const participantInfo = await Promise.all(participants.map(async id => {
                        const user = await client.users.cache.get(id);
                        return `${user.username || "Inconnue"} (ID: ${id})`;
                    }));
                    const participantList = participantInfo.join('\n');
                    interaction.reply({ content: `Participants du giveaway :\n\`\`\`yml\n${participantList}\`\`\``, ephemeral: true });
                } else {
                    interaction.reply({ content: "Aucun participant pour le moment.", ephemeral: true });
                }
            }
        }

        if (customId.startsWith('giveaway_leave_')) {
            const giveawayCode = customId.split('_')[2];

            const giveawayData = await client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                const index = giveawayData.participant.indexOf(user.id);
                if (index !== -1) {
                    giveawayData.participant.splice(index, 1);
                    await client.db.set(`giveaway_${interaction.guildId}_${giveawayCode}`, giveawayData);
                    interaction.update({ content: "Vous avez quitté le giveaway.", components: [], ephemeral: true });
                }
            }
        }
    }
};

