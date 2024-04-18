const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const { exec } = require('child_process');

module.exports = {
    name: "restart",
    description: "Redémarre le bot.",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        
        message.channel.send({ content: 'Redémarrage...' }).then(async () => {
            await client.db.set(`restartchannel`, message.channel.id);
            exec(`pm2 restart ${client.user.id}`, async (err, stdout, stderr) => {
                if (err.code === 1) {
                    return message.channel.send('Instance PM2 non existante...');
                }
                if (err) {
                    message.channel.send("Une erreur vient de se produire : \`\`\`js\n" + err.message + "\`\`\`");
                }
            });
        })
    }
};
