const Snoway = require('../../structures/client/index');
const Discord = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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'
});
module.exports = {
    name: 'chatgpt',
    description: {
        fr: "Permet de discuter avec ChatGPT",
        en: "Chat with ChatGPT"
    },
    usage: {
        fr: {"chatgpt <message>": "Permet de discute ChatGPT-3"},
        en: {"chatgpt <message>": "Allows ChatGPT-3 discussion"},
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Snoway} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const userMessage = args.join(' ');

        if (!userMessage) {
            return message.reply("Veuillez fournir un message pour discuter.");
        }

        try {
            const msg = await message.reply(`Merci de patienter`)
            const completion = await openai.chat.completions.create({
                messages: [{ "role": "system", "content": userMessage }],
                model: "gpt-3.5-turbo",
            });
            msg.edit({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(completion.choices[0].message.content)
                        .setColor(client.color)
                        .setFooter({ text: "Snoway X Chatgpt" })
                ],
                content: null
            })
        } catch (error) {
            console.error('Erreur:', error);
            message.reply("Une erreur est survenue.");
        }
    },
};
