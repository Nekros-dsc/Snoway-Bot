const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'massremove',
    description: {
        fr: "Permet de supprimer un rôle à la totalité du serveur",
        en: "Removes a role from the entire server"
    },
    usage: {
        fr: { "massremove <rôle>": "Permet de supprimer un rôle à la totalité du serveur" },
        en: { "massremove <rôle>": "Removes a role from the entire server" }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((r) => r.name === args[0]);
       
        if (!role) {
            return message.reply('Veuillez spécifier un rôle valide.');
        }

        const members = message.guild.members.cache.filter(
            (m) => m.roles.cache.has(role.id)
        );

        const totalMembers = members.size;
        const batchSize = Math.ceil(totalMembers * 0.05); 
        let count = 0;

        message.channel.send(`[\`0%\`] Suppression du rôle : \`${role.name}\` à \`${totalMembers}\` membre${totalMembers !== 1 ? "s" : ""}`).then(async (msg) => {
            for (const [memberID, member] of members) {
                await member.roles.remove(role).catch(console.error); 
                count++;
                if (count % batchSize === 0 || count === totalMembers) {
                    const progress = Math.floor((count / totalMembers) * 100);
                    msg.edit(`[\`${progress}%\`] Suppression du rôle : \`${role.name}\` à \`${totalMembers}\` membre${totalMembers !== 1 ? "s" : ""}`);
                }
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            msg.edit('Le rôle a été supprimé à tous les membres avec succès.');
        }).catch(console.error);
    }
}
