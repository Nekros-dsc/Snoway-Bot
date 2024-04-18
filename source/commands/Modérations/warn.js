const Snoway = require("../../structures/client");

module.exports = {
    name: "warn",
    description: {
        fr: "Permet d'ajouter un avertissement à un membre du serveur",
        en: "Adds a warning to a server member"
    },
    usage: {
        fr: {
            "warn <@user/ID> [raison]": "Permet d'ajouter un avertissement à un membre du serveur",
        }, en: {
            "warn <@user/ID> [raison]": "Adds a warning to a server member"
        }
    },
    /**
     * @param {Snoway} client
     * @param {Snoway} message
     * @param {Snoway} args
     * @returns
     */
    run: async (client, message, args) => {
        try {
            let user = message.mentions.users.first();
            let memberId = args[0];

            if (!user && memberId) {
                user = await client.users.fetch(memberId).catch(() => null);
            }

            if (!user) {
                return message.channel.send(`> \`❌\` Erreur : Usage: \`warn <Mention/Id> [reason]\``);
            }

            let reason = args.slice(1).join(' ') || null;
            const db = await client.db.get(`sanction_${message.guild.id}`) || []
            const genkey = client.functions.bot.gen()
            db.push({
                userId: user.id,
                code: genkey,
                reason: reason,
                date: Date.now()
            })
            await client.db.set(`sanction_${message.guild.id}`, db)
            message.reply({
                content: `<@${user.id}> a été **warn** pour \`${reason || "Aucune"}\``
            })
        } catch (err) {
            console.error('Erreur:', err);
            message.reply("Une erreur vient de se produire...");
        }
    }
};
