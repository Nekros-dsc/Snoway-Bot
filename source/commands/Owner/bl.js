const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
    description: {
        fr: "Affiche la liste des utilisateurs blacklistés",
        en: "Displays the list of blacklisted users"
    },
    usage: {
        fr: {
            "bl": "Affiche la liste des utilisateurs blacklistés",
            "bl <mention/id> [raison]": "Ajouter un utilisateur dans la blacklist",
            "bl clear": "Retire tout les utilisateurs blacklistés"
        },
        en: {
            "bl": "Displays the list of blacklisted users",
            "bl <mention/id> [reason]": "Add a user to the blacklist",
            "bl clear": "Remove all blacklisted users"
        },
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {*} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const blacklist = await client.db.get(`blacklist`) || [];

        if (args[0] === 'clear') {
            await client.db.delete(`blacklist`);
            return message.reply(`La liste des utilisateurs blacklistés a été effacée.`);
        }

        let user = message.mentions.users.first();
        let memberId = args[0];

        if (!user && memberId) {
            try {
                user = await client.users.fetch(memberId);
            } catch (error) {
                console.error(error);
            }
        }
        
        if (!user && !memberId) {
            const blacklistEmbed = new EmbedBuilder()
                .setTitle("Blacklist")
                .setDescription(blacklist.map(entry => `<@${entry.userId}>`).join('\n') || "None")
                .setFooter(client.footer)
                .setColor(client.color);
    
            return message.channel.send({ embeds: [blacklistEmbed] });
        }
        if (blacklist.some(entry => entry.userId === (memberId || user.id))) {
           return message.reply({
            content: `${user.username} est déjà dans la blacklist`
           })
        }
        const reason = args.slice(1).join(' ') || null;
        const owner = await client.db.get(`owner`) || [];
        if (owner.includes(user.id) || client.config.buyers.includes(user.id)) {
            return message.channel.send(`Je ne peux pas blacklist un owner ou buyer bot`);
        }


        const member = user;
        const messages = await message.channel.send(`Début de la blacklist pour ${member.username}...`);
        let bansSuccess = 0;
        let bansFailed = 0;

        await Promise.all(client.guilds.cache.map(async (guild) => {
            try {
                await guild.members.ban(member.id, { reason: `BLACKLIST | by ${message.author.tag}` });
                bansSuccess++;
                await new Promise(resolve => setTimeout(resolve, 800)); 
            } catch (error) {
                console.error(`Impossible de bannir ${member.username} de ${guild.name}`);
                bansFailed++;
            }
        }));

        messages.edit(`${messages.content}\n${member.username} a été blacklisté de \`${bansSuccess}\` serveurs avec succès et a échoué sur \`${bansFailed}\` serveurs.\nRaison: \`${reason || "Aucune raison spécifiée"}\``);
        
        blacklist.push({ userId: member.id, raison: reason, date: Date.now(), author: message.author.id });
        await client.db.set(`blacklist`, blacklist);
    }
};
