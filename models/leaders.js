const mongoose = require('mongoose');
const { Schema } = mongoose;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

/**
 * {
 *   "name": "Peter Pan",
 *   "image": "images/alberto.png",
 *   "designation": "Chief Epicurious Officer",
 *   "abbr": "CEO",
 *   "featured": "false",
 *   "description": "Our CEO, Peter, credits his hardworking East Asian immigrant parents who undertook the arduous journey to the shores of America with the intention of giving their children the best future. His mother's wizardy in the kitchen whipping up the tastiest dishes with whatever is available inexpensively at the supermarket, was his first inspiration to create the fusion cuisines for which The Frying Pan became well known. He brings his zeal for fusion cuisines to this restaurant, pioneering cross-cultural culinary connections."
 * }
 */

const leadersScheme = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Leaders = mongoose.model('Leader', leadersScheme);

module.exports = Leaders;