const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'langue',
    description: 'Change la langue du bot',
    usage: {
        fr: {"langue <fr/en>": "Change la langue du bot"},
        en: {"langue <fr/en>": "Change bot language"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     */
        run: async(client, message, args, commandName) => {
        
        const langCode = args[0];

        const dblangue = await client.db.get(`langue`)

        if(!langCode){
            return message.channel.send(await client.lang('langue.nolang'))
        }
        if(dblangue === langCode) {
            const response = (await client.lang('langue.deja')).replace("{langCode}", `\`${dblangue}\``)
            message.channel.send(response)
            return; 
        }
        if (!langCode) {
            return message.channel.send(await client.lang('langue.erreur')).catch(() => {});
        }

        if (!isValidLanguage(langCode)) {
            return message.channel.send(await client.lang('langue.invalide')).catch(() => {});
        }

      await client.db.set('langue', langCode);
        const response = (await client.lang('langue.set')).replace("{langCode}", `\`${langCode}\``)
        return message.channel.send({content: response}).catch(() => {});
    }
};

function isValidLanguage(langCode) {
    const validLanguages = ["fr", "en"];
    return validLanguages.includes(langCode);
}
