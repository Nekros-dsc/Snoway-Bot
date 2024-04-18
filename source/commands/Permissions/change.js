const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'change',
    description: {
        fr: "Change la permission d'une commande",
        en: "Change the permission of a command"
    },
    usage: {
        fr: {
            "change <commande> <permission/public>": "Permet de changer l'accessibilité d'une commande à une permission",
        },
        en: {
            "change <command> <permission/public>": "Allows you to change the accessibility of a command to a permission",
        }
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        if (args.length !== 2) {
            return message.reply(`> \`❌\` Erreur : Usage : \`${client.prefix}change <cmd> <1/2/3/4/5/6/7/8/9/public>\``);
        }

        const commandInput = args[0].toLowerCase();
        const commandName = client.commands.get(commandInput)?.name;

        if (!commandName) {
            return message.reply("> `❌` Erreur : Commande invalide !");
        }

        const newPermissionIndex = args[1].toLowerCase() === 'public' ? 'public' : parseInt(args[1]);

        if (args[1].toLowerCase() !== 'public' && (isNaN(newPermissionIndex) || newPermissionIndex < 1 || newPermissionIndex > 9)) {
            return message.reply("> `❌` Erreur : Permission invalide !");
        }

        const oldPermissions = await client.db.get(`perms_${message.guild.id}`);
        const newPermissions = oldPermissions || {};

        if (newPermissionIndex === 'public') {
            const publicPermissionIndex = newPermissions['public'];

            if (publicPermissionIndex && publicPermissionIndex.commands.includes(commandName)) {
                return message.reply(`> \`❌\` La commande \`${commandName}\` est déjà dans la permission \`public\`.`);
            }

            for (const perm in newPermissions) {
                if (perm !== 'public') {
                    const indexToRemove = newPermissions[perm].commands.indexOf(commandName);
                    if (indexToRemove !== -1) {
                        newPermissions[perm].commands.splice(indexToRemove, 1);
                    }
                }
            }
            const status = oldPermissions['public'].status
            newPermissions['public'] = {
                role: null,
                status: status,
                commands: [...(publicPermissionIndex?.commands || []), commandName]
            };
        } else {
            const oldPermissionIndex = newPermissions[`perm${newPermissionIndex}`];

            if (oldPermissionIndex && oldPermissionIndex.commands.includes(commandName)) {
                return message.reply(`> \`❌\` La commande \`${commandName}\` est déjà dans la permission \`${newPermissionIndex}\`.`);
            }

            for (const perm in newPermissions) {
                if (perm !== `perm${newPermissionIndex}`) {
                    const indexToRemove = newPermissions[perm].commands.indexOf(commandName);
                    if (indexToRemove !== -1) {
                        newPermissions[perm].commands.splice(indexToRemove, 1);
                    }
                }
            }

            newPermissions[`perm${newPermissionIndex}`] = {
                role: null,
                commands: [...(oldPermissionIndex?.commands || []), commandName]
            };
        }

        await client.db.set(`perms_${message.guild.id}`, newPermissions);

        return message.reply(`La commande \`${commandName}\` a bien été modifiée.`);
    }
};
