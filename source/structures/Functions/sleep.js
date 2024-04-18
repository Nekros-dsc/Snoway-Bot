module.exports = {
    sleep: function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
};
