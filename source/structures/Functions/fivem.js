const { QuickDB } = require("quick.db");
const { EmbedBuilder } = require('discord.js');
const db = new QuickDB();

async function getStatus() {
    const FiveM = require("fivem");
    const ipserv = await getServerdb();

    try {
        const srv = new FiveM.Server(ipserv);
        const data = await srv.getServerStatus();
        return data.online;
    } catch (error) {
        console.error("Erreur:", error);
        return false; 
    }
}

async function getPlayerMax() {
    const FiveM = require("fivem");
    const ipserv = await getServerdb();
    try {
        const srv = new FiveM.Server(ipserv);
        const data = await srv.getMaxPlayers();
        return {
            max: data
        };
    } catch (error) {
        if(error.message === "Error: Please provide an IP.") {
            return {
                max: "Impossible à récupérer"
            };   
        }
    }
}

async function getAllPlayer() {
    const FiveM = require("fivem");
    const ipserv = await getServerdb();

    try {
        const srv = new FiveM.Server(ipserv);
        console.log(await srv.getPlayersAll())
        const data = await srv.getPlayersAll();
        return {
            serv: data
        };
    } catch (error) {
        if(error.message === "Error: Please provide an IP.") {
            return {
                serv: "Impossible à récupérer"
            };   
        }
    }
}

async function getServerdb() {
    const dbs = await db.get(`fivemip`);
    if (dbs) return ''; 

    const { ip, port } = dbs;
    return `${ip}:${port}`;
}

module.exports = {
    getStatus,
    getPlayerMax,
    getAllPlayer,
    getServerdb
};