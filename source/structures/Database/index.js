const perm = require('./guild')
class Model {
    constructor(client, database) {
        this.client = client;
        this.db = database;
        this.start();
    }

    async start() {
        perm(this.client, this.db);
    }
}

module.exports = Model;
