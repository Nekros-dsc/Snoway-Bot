const perm = require('./perms')
const api = require('./manager')
const bot = require('./bot')
const fivem = require('./fivem')
const config = require('./config')
const discord = require('./discord')
const emoji = require('./emoji')
module.exports = {
    perm,
    api,
    fivem,
    bot,
    config,
    emoji,
    discord
}