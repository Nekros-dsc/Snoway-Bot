const Snoway = require('../../structures/client/index.js');
const axios = require('axios');
const config = require('./config')
const config_bot = require('../../../config/config')
module.exports = {
    async getImageAnime(action) {
        try {
            const actions = ["pat", "hug", "waifu", "cry", "kiss", "slap", "smug", "punch", "smile"];
            if (!actions.includes(action.toLowerCase())) {
                throw `Action inconnue, options d'action valides : ${actions.join(", ")}`;
            }

            const url = `https://api.giphy.com/v1/gifs/search?api_key=${config.api.giphy.token}&rating=g&q=anime+${action}`;
            const response = await axios.get(url);
            if (response.data.data && response.data.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.data.length);
                const gifUrl = response.data.data[randomIndex].images.preview_gif.url;
                return gifUrl;
            } else {
                console.error('Aucune donnée de GIF trouvée.');
            }
        } catch (erreur) {
            console.error(`Erreur: ${erreur.message || erreur}`);
        }
    },

    gen() {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const number = "0123456789"
            let keys = [];
        
            for (let i = 0; i < 1; i++) {
                let keySection1 = Array.from({ length: 4 }, () => number[Math.floor(Math.random() * number.length)]).join('');
                let keySection2 = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
                let keySection3 = Array.from({ length: 4 }, () => number[Math.floor(Math.random() * number.length)]).join('');
                let keySection4 = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        
                let key = `SNOW-${keySection1}-${keySection2}-${keySection3}-${keySection4}`;
                keys.push(key);
            }
        
            return keys;
        
    },

    code() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            return code;
    },
 
    maj(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    discordlink(string) {
        const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)/i;
        return discordInviteRegex.test(string);
    },

    linkall(string) {
        const generalLinkRegex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/gi;
        return generalLinkRegex.test(string);
    },

    async user(userId) {
        try {
            const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
                headers: {
                    'Authorization': 'Bot ' + config_bot.token,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    refreshConfig() {
        delete this.config;
        delete require.cache[require.resolve('../../../config/config')];
        this.config = require('../../../config/config');
    },
    
    async invite(invite_url) {
        const response = await axios.get(`https://discord.com/api/v10/invites/${invite_url}`, {
            headers: {
                'Authorization': "Bot " + config_bot.token
            }

        })
        return response.data
    },


    async formaTime(temps) {
        let time 
        if (temps < 60) {
            time = `${temps} secondes`;
        } else if (temps < 3600) {
            const minutes = Math.floor(temps / 60);
            const seconds = temps % 60;
            time = `${minutes} minute${minutes !== 1 ? 's' : ''} et ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
        } else if (temps < 86400) {
            const heures = Math.floor(temps / 3600);
            const minutes = Math.floor((temps % 3600) / 60);
            time = `${heures} heure${heures !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else if (temps < 31536000) {
            const jours = Math.floor(temps / 86400);
            const heures = Math.floor((temps % 86400) / 3600);
            time = `${jours} jour${jours !== 1 ? 's' : ''}, ${heures} heure${heures !== 1 ? 's' : ''}`;
        } else {
            const années = Math.floor(temps / 31536000);
            const jours = Math.floor((temps % 31536000) / 86400);
            time = `${années} an${années !== 1 ? 's' : ''}, ${jours} jour${jours !== 1 ? 's' : ''}`;
        }
    
        return time;
    
    },

    async color(colorArg) {
        const colorMap = {
            "rouge": "#FF0000",
            "vert": "#00FF00",
            "bleu": "#0000FF",
            "noir": "#000000",
            "blanc": "#FFFFFF",
            "rose": "#dc14eb",
            "violet": "#764686",
            "sown": "#e1adff",
            "inside": "#99fcff",
            "orange": "#FFA500",
            "jaune": "#FFFF00",
            "marron": "#A52A2A",
            "gris": "#808080",
            "argent": "#C0C0C0",
            "cyan": "#00FFFF",
            "lavande": "#E6E6FA",
            "corail": "#FF7F50",
            "beige": "#F5F5DC",
            "defaut": config_bot.color
        };

        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const lowerCaseColorArg = colorArg.toLowerCase();
        if (lowerCaseColorArg in colorMap) {
            const color = colorMap[lowerCaseColorArg];
            return color;
        } else if (colorRegex.test(colorArg)) {
            return colorArg;
        } else {
            return false;
        }
    }


};