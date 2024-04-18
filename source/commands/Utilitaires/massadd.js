const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'massadd',
    description: {
        fr: "Permet d'ajouter un rôle à la totalité du serveur",
        en: "Adds a role to the entire server"
    },
    usage: {
        fr: { "massadd <rôle>": "Permet d'ajouter un rôle à la totalité du serveur" },
        en: { "massadd <rôle>": "Adds a role to the entire server" }
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
            (m) => !m.roles.cache.has(role.id)
        );

        const totalMembers = members.size;
        const batchSize = Math.ceil(totalMembers * 0.05); 
        let count = 0;

        message.channel.send(`[\`0%\`] Ajout du rôle : \`${role.name}\` à \`${totalMembers}\` membre${totalMembers !== 1 ? "s" : ""}`).then(async (msg) => {
            for (const [memberID, member] of members) {
                await member.roles.add(role).catch(console.error); 
                count++;
                if (count % batchSize === 0 || count === totalMembers) {
                    const progress = Math.floor((count / totalMembers) * 100);
                    msg.edit(`[\`${progress}%\`] Ajout du rôle : \`${role.name}\` à \`${totalMembers}\` membre${totalMembers !== 1 ? "s" : ""}`);
                }
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            msg.edit('Le rôle a été ajouté à tous les membres avec succès.');
        }).catch(console.error);
    }
}
