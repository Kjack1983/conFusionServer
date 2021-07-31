require('dotenv').config();

module.exports = {
    'secretKey': process.env.JWT_SECRET,
    'mongoUrl' : process.env.DATABASE
}