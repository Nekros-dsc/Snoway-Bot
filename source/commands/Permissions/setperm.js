module.exports = {
    name: 'setperm',
    description: 'Attribue un rôle à une permission.',
    usage: {
        fr: {'setperm <permission> <role>': "Attribue un rôle à une permission."},
        en: {
            'setperm <permission> <role>': "Assigns a role to a permission."
        }
    },
    run: async (client, message, args) => {


        if (args.length !== 2) {
            return message.channel.send(`\`❌\` Erreur: \`${client.prefix}setperm (1/2/3/4/5/6/7/8/9) @role\``);
        }

        const permission = args[0];
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!permission || !role) {
            return message.channel.send('\`❌\` Erreur: Permission ou rôle invalide.');
        }

        const permissionIndex = await client.db.get(`perms_${message.guild.id}`) || {};
        if (permissionIndex["perm" + permission]) {
            permissionIndex["perm" + permission].role = role.id;
            await client.db.set(`perms_${message.guild.id}`, permissionIndex);
            message.channel.send(`Le rôle associé à la permission \`${permission}\` a été mis à jour vers \`${role.name}\`.`);
        } else {
            message.channel.send(`\`❌\` Erreur: La permission \`${permission}\` n'existe pas.`);
        }
    },
};
