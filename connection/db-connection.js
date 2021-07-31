const db_connection = require('mongoose');
const config = require('../config');

class DbInteraction {
    static connectToDb() {
        db_connection.connect(config.mongoUrl).then(() => {
            console.log('%c%s', 'color: #00a3cc', 'Connected successfully to database');
        }).catch((err) => {
            console.log('%c%s', 'color: #e6000c', err);
        });
    };   
}

module.exports = DbInteraction;


