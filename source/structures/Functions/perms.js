const { QuickDB } = require("quick.db")
const db = new QuickDB();
const config = require("../../../config/config")


async function owner(userId) {
    const database = await db.get(`owner`) || []
    return database.includes(userId)
}

async function buyer(userId) {
    return config.buyers.includes(userId)
}
module.exports = {
    owner,
    buyer
}