const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'activity',
    description: {
        fr: "Change le status du bot !",
        en: "Change bot status!"
    },
    usage: {
        fr: {
            "activity playing <message>": "Affiche le statut de bot comme si il jouait à un jeu",
            "activity streaming <message>": "Affiche le statut du bot comme si il était en live",
            "activity listening <message>": "Affiche le statut du bot comme si il écouté de la musique",
            "activity watching <message>": "Affiche le statut du bot comme si il regardait un partage d'écran",
            "activity competing <message>": "Affiche la statut du bot comme si il était en pleine compétition",
            "activity clear": "Supprime le message d'activité du bot",
        }, en: {
            "activity playing <message>": "Displays bot status as if it were playing a game",
            "activity streaming <message>": "Displays bot status as if it were live",
            "activity listening <message>": "Displays bot status as if listening to music",
            "activity watching <message>": "Displays the bot's status as if it were watching a screen share",
            "activity competing <message>": "Displays the bot's status as if it were competing",
            "activity clear": "Deletes the bot's activity message",
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message
     * 
     **/
    run: async (client, message, args) => {
        const db = await client.db.get('status') || {
            type: 3,
            name: "Snoway V3",
            status: 'dnd'
        };
        const activityType = args[0];
        const presence = db.status;
        const name = args.slice(1).join(' ');
        let activity;
        if (activityType === "clear") {
            db.name = "Snoway V" + require('../../../version'),
                db.type = 3
            client.user.setPresence({
                status: presence ? presence : "dnd",
                activities: [
                    {
                        name: "Snoway V" + require('../../../version'),
                        type: 3,
                        url: "https://twitch.tv/oni145"
                    },
                ],
            });
            return message.channel.send(await client.lang('activity.clear'))
        }

        if ((activityType === 'playto' || activityType === 'play' || activity === "playing")) {
            db.name = name
            db.type = 0
        } else if (activityType === 'watch' || activityType === "watching") {
            db.name = name
            db.type = 3
        } else if (activityType === 'listen' || activityType === 'listening') {
            db.name = name
            db.type = 2
        } else if (activityType === 'stream' || activityType === 'streaming') {
            db.name = name
            db.type = 1
        } else if (activityType === 'competing' || activity === "compet") {
            db.name = name
            db.type = 5
        } else {
            return message.channel.send({ content: `${await client.lang('activity.invalide')} \`${client.prefix}activity playto\`, \`${client.prefix}activity watching\`, \`${client.prefix}activity competing\`, \`${client.prefix}activity listen\` ${await client.lang('activity.ou')} \`${client.prefix}activity streaming\``, allowedMentions: { repliedUser: false } });
        }


        await client.db.set('status', db)
        await message.channel.send({ content: `${await client.lang('activity.set')} \`${activityType}\` \`${name}\`.` });

        client.user.setPresence({
            status: presence ? presence : "dnd",
            activities: [
                {
                    name: db?.name,
                    type: db?.type,
                    url: "https://twitch.tv/oni145"
                },
            ],
        });

    }
};