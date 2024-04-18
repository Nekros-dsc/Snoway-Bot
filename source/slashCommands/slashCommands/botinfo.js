const Discord = require('discord.js');
const os = require('os');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'botinfo',
    description: "Affiche les informations du bot",
    description_localizations: {
        "fr": "Affiche les informations du bot", 
        "en-US": "Displays bot information"
    },
    type: 1,
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @param {string[]} args 
     */
    run: async (client, interaction) => {
        const dev = await Promise.all(
            client.dev.map(async (id) => {
                const user = await client.users.fetch(id);
                return user.discriminator === 0 ? user.username : user.tag;
            })
        );
        const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color
        const langue = await client.db.get(`langue`)
        const uptime = formatUptime(os.uptime(), langue);
        const uptimebot = formatUptime(client.uptime / 1000, langue)
        const totalMemory = formatBytes(os.totalmem());
        const usedMemory = format(os.totalmem() - os.freemem())
        const embed = new Discord.EmbedBuilder()
            .setTitle('Mes statistiques')
            .setColor(color)
            .setFooter(client.footer)
            .addFields({
                name: "Statistique du bot", 
                value:`\`\`\`ANSI\n` +
                `[1;31mDéveloppeurs:[0m [107;49m${dev.join(', ')}[0m\n` +
                `[1;31mCommandes:[0m [107;49m${client.commands.size}[0m\n` +
                `[1;31mServeurs:[0m [107;49m${client.guilds.cache.size}[0m\n` +
                `[1;31mChannels:[0m [107;49m${client.channels.cache.size}[0m\n` +
                `[1;31mMembres:[0m [107;49m${client.users.cache.size}[0m\n` +
                `[1;31mNodeJs:[0m [107;49m${process.version}[0m\n` +
                `[1;31mDiscordJs:[0m [107;49mv${Discord.version}[0m\n` +
                `[1;31mUptime:[0m [107;49m${uptimebot}[0m\n` +
                `\`\`\``} , {
                name: "Statistique du VPS",
                value: `\`\`\`ANSI\n` +
                    `[1;31mUptime:[0m [107;49m${uptime}[0m\n` +
                    `[1;31mCPU Cores:[0m [107;49m${os.cpus().length}[0m\n` +
                    `[1;31mRAM:[0m [107;49m${usedMemory}/${totalMemory}[0m\n` +
                    `\`\`\``
            });

            interaction.reply({
            embeds: [embed]
        });
    },
};

function formatUptime(uptime, lang) {
    const timeUnits = lang === 'fr' ? ['jours', 'heures', 'minutes', 'secondes'] : ['days', 'hours', 'minutes', 'seconds'];
    
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / 3600) % 24);
    const days = Math.floor(uptime / 86400);

    const formattedTime = [];
    
    if (days > 0) {
        formattedTime.push(`${days} ${days > 1 ? timeUnits[0] : timeUnits[0].slice(0, -1)}`);
    }

    if (hours > 0) {
        formattedTime.push(`${hours} ${hours > 1 ? timeUnits[1] : timeUnits[1].slice(0, -1)}`);
    }

    if (minutes > 0) {
        formattedTime.push(`${minutes} ${minutes > 1 ? timeUnits[2] : timeUnits[2].slice(0, -1)}`);
    }

    if (seconds > 0) {
        formattedTime.push(`${seconds} ${seconds > 1 ? timeUnits[3] : timeUnits[3].slice(0, -1)}`);
    }

    return formattedTime.join(', ');
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log2(bytes) / 10);
    return `${(bytes / Math.pow(2, 10 * i)).toFixed(2)} ${sizes[i]}`;
}

function format(bytes) {
    const i = Math.floor(Math.log2(bytes) / 10);
    return `${(bytes / Math.pow(2, 10 * i)).toFixed(2)}`;
}
