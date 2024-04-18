const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'defaultrole',
    aliases: ["defaultroles"],
    description: {
        fr: 'Configure le rôle par défaut pour les nouveaux membres',
        en: "Configures the default role for new members"
    },
    usage: {
        fr: {
            "defaultrole <rôles>": "Permet d'ajouter ou de retirer des rôles dans les rôles défaut",
            "defaultrole": "Affiche la liste des rôles donnés lorsqu'un membre rejoint",
        }, en: {
            "defaultrole <roles>": "Allows roles to be added to or removed from default roles",
            "defaultrole": "Displays the list of roles given when a member joins",
        }
    },
    /**
     * @param {Snoway} client 
     * @param {Snoway} message 
     * @param {Snoway} args 
     */
    run: async (client, message, args) => {

        const roleName = args[0];
        const db = await client.db.get(`defautrole_${message.guild.id}`) || {
            roles: []
        };

        if (!roleName) {
            const role = db.roles.map((role, index) => {
                return `${index + 1}) <@&${role}>`
            }).join("\n")
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setFooter(client.footer)
                .setTitle(await client.lang('defautrole.embed.title'))
                .setDescription(role || await client.lang('defautrole.embed.aucun'))
            return message.channel.send({
                embeds: [embed]
            })
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === roleName) || message.guild.roles.cache.find(r => r.id === roleName);

        if (!role) {
            return message.channel.send((await client.lang('defautrole.no')).replace('{RoleName}', `\`${roleName}\``))
        }
        const roleIndex = db.roles.indexOf(role.id);

        if (roleIndex !== -1) {
            db.roles.splice(roleIndex, 1);
            message.channel.send(`\`${role.name}\` ${await client.lang('defautrole.remove')}`);
        } else {
            db.roles.push(role.id);
            message.channel.send(`\`${role.name}\` ${await client.lang('defautrole.add')}`);
        }

        await client.db.set(`defautrole_${message.guild.id}`, db);
    }
};
