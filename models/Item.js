const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    low: { type: Date, default: null }
}, { timestamps: true });

itemSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Item', itemSchema);