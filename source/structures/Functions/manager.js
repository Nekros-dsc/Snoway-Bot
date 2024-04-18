const axios = require('axios');
const config = require("../../../config/config")
const config_api = require('./config')

async function prevclear(userId) {
    const response = await axios.post(`${config_api.snoway.panel}/prevname/clear`, {
        userId: userId,
    }, {
        headers: {
            'api-Key': config_api.snoway.api
        }

    }).catch(() => { e => console.log(e) })
    return response.data
}

async function prevget(userId) {
    const response = await axios.post(`${config_api.snoway.panel}/prevname/get`, {
        userId: userId,
    }, {
        headers: {
            'api-key': config_api.snoway.api
        }

    }).catch((e) => { console.log(e) })
    return response.data
}


async function prevadd(userId, prevname) {
    const response = await axios.post(`${config_api.snoway.panel}/prevname/add`, {
        prevname: prevname,
        userId: userId,
    }, {
        headers: {
            'api-key': config_api.snoway.api
        }

    }).catch(() => { e => console.log(e) })
    return response.data
}

async function prevcount() {
    const response = await axios.post(`${config_api.snoway.panel}/prevname/count`, null, {
        headers: {
          'api-key': ["eHNdapE343dET5GY5ktc978ABhg4w3suD5Ny4sEW4F5KLg8u84"]
        }
      });
    return response.data
}


async function botget(userId) {
    const response = await axios.post(`${config_api.manager.panel}/bots/get`, {
        ownerId: userId,
    }, {
        headers: {
            'api-key': config_api.manager.key
        }

    }).catch(() => { e => console.log(e) })
    return response.data
}



async function owneradd(botId, userId) {
    const response = await axios.post(`${config_api.manager.panel}/bots/owner/add`, {
        BotId: botId,
        owner: userId
    }, {
        headers: {
            'api-key': config_api.manager.key
        }

    }).catch(() => { })
}

async function ownerdel(botId, userId) {
    const response = await axios.post(`${config_api.manager.panel}/bots/owner/remove`, {
        BotId: botId,
        owner: userId
    }, {
        headers: {
            'api-key': config_api.manager.key
        }

    }).catch(() => { })
}

async function ownerclear(botId) {
    const response = await axios.post(`${config_api.manager.panel}/bots/owner/clear`, {
        BotId: botId,
    }, {
        headers: {
            'api-key': config_api.manager.key
        }

    }).catch(() => { })
}

module.exports = {
    prevclear,
    prevget,
    prevadd,
    botget,
    owneradd,
    ownerdel,
    ownerclear,
    prevcount
}