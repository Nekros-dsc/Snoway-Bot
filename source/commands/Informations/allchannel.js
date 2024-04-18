const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'allchannel',
    description: {
        fr: "Affiche tous les salons & catégories du serveur",
        en: "Displays all lounges & categories on the server"
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        try {
            const color = parseInt(client.color.replace("#", ""), 16);
            const allChannels = message.guild.channels.cache;

            const channelList = allChannels.map((channel) => {
                let text = "";
                switch (channel.type) {
                    case 0:
                        text = "Text";
                        break;
                    case 2:
                        text = "Vocal";
                        break;
                    case 4:
                        text = "Catégorie";
                        break;
                    default:
                        text = "Inconnu";
                }

                return `${channel.type === 4 ? `\`#${channel.name}\`` : `<#${channel.id}>`} (Type: **${text}**)`;
            }).join('\n');

            const embedMessage = await message.channel.send({
                embeds: [
                  {
                        color: color,
                        footer: {
                            text: `Résultat(s) : ${allChannels.size}\n${message.guild.name} - ${client.footer.text}`
                        },                        
                        title: `Liste des channels sur ${message.guild.name}`,
                        description: channelList,
                    },
                ],
            });

        } catch (error) {
            console.error('Erreur dans la commande allchannel :', error);
            message.channel.send('Une erreur s\'est produite.');
        }
    },
};
