const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Chat = mongoose.model('chat', ChatSchema);


