const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'myperm',
    description: {
        en: "Check your own permissions for specified actions",
        fr: "Vérifiez vos propres autorisations sur le serveur"
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const permissionsToCheck = [
            'CreateInstantInvite',
            'KickMembers',
            'BanMembers',
            'Administrator',
            'ManageChannels',
            'ManageGuild',
            'AddReactions',
            'ViewAuditLog',
            'PrioritySpeaker',
            'Stream',
            'ViewChannel',
            'SendMessages',
            'SendTTSMessages',
            'ManageMessages',
            'EmbedLinks',
            'AttachFiles',
            'ReadMessageHistory',
            'MentionEveryone',
            'UseExternalEmojis',
            'ViewGuildInsights',
            'Connect',
            'Speak',
            'MuteMembers',
            'DeafenMembers',
            'MoveMembers',
            'UseVAD',
            'ChangeNickname',
            'ManageNicknames',
            'ManageRoles',
            'ManageWebhooks',
            'ManageEmojisAndStickers',
            'ManageGuildExpressions',
            'UseApplicationCommands',
            'RequestToSpeak',
            'ManageEvents',
            'ManageThreads',
            'CreatePublicThreads',
            'CreatePrivateThreads',
            'UseExternalStickers',
            'SendMessagesInThreads',
            'UseEmbeddedActivities',
            'ModerateMembers',
            'ViewCreatorMonetizationAnalytics',
            'UseSoundboard',
            'UseExternalSounds',
            'SendVoiceMessages'
        ]

        const memberPermissions = message.member.permissions.toArray();

        const allowedPermissions = permissionsToCheck.filter(permission => memberPermissions.includes(permission));
        const permissionsEmbed = new Discord.EmbedBuilder()
            .setTitle('Permissions de ' + message.author.username)
            .setURL(client.support)
            .setDescription(`\`\`\`js\n${allowedPermissions.join('\n') || "Aucune"}\`\`\``)
            .setColor(client.color);

        message.channel.send({ embeds: [permissionsEmbed] });
    },
};
