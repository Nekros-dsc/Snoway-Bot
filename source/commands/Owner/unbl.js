const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'unblacklist',
    aliases: ['unbl'],
    description: {
        fr: "Retire un utilisateur de la blacklist et le déban de tous les serveurs",
        en: "Remove a user from the blacklist and unban them from all servers"
    },
    usage: {
        fr: {
            "unbl <mention/id>": "Retire un utilisateur de la blacklist",
        },
        en: {
            "unbl <mention/id>": "Remove a user from the blacklist",
        },
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const blacklist = await client.db.get(`blacklist`) || [];
        let user = message.mentions.users.first();
        let memberId = args[0];

        if (!user && memberId) {
            try {
                user = await client.users.fetch(memberId);
            } catch (error) {
                console.error(error);
            }
        }

        if (!user || !memberId) {
            return message.reply({
                content: "Utilisateur invalide !"
            });
        }

        const blacklistedUserIndex = blacklist.findIndex(entry => entry.userId === user.id);

        if (blacklistedUserIndex === -1) {
            return message.reply({
                content: `${user.username} n'est pas dans la blacklist.`
            });
        }

        const member = user;

        let unbansSuccess = 0;
        let unbansFailed = 0;

        await Promise.all(client.guilds.cache.map(async (guild) => {
            try {
                await guild.members.unban(member.id, `UNBLACKLIST | by ${message.author.tag}`);
                unbansSuccess++;
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (error) {
                console.error(`Impossible de débannir ${member.username} de ${guild.name}`);
                unbansFailed++;
            }
        }));

        blacklist.splice(blacklistedUserIndex, 1);
        await client.db.set(`blacklist`, blacklist);

        return message.reply(` ${member.username} a été retiré de la blacklist et débanni de \`${unbansSuccess}\` serveurs avec succès et a échoué sur \`${unbansFailed}\` serveurs.`);
    }
};
