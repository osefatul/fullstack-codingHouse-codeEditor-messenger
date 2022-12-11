const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        topic: { type: String, required: true },
        roomType: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
        speakers: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            required: false,
        },
        conversation: [
            {
                sender: {type: String, ref: 'User'},
                message: {type: String},
                msgAt: {
                    type: Date,
                    default: Date.now(),
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Room', roomSchema, 'rooms');