require('dotenv').config();

module.exports = {
    'secretKey': process.env.JWT_SECRET,
    'mongoUrl' : process.env.DATABASE,
    'facebook' : {
        clientId: '831175850920302',
        clientSecret: 'b4559793b39ba97df47b1c9ba3cd4b65'
    }
}