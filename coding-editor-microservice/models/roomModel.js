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
                sender: {type: Schema.Types.ObjectId, ref: 'User'},
                message: {type: String},
                msgAt: {
                    type: Date,
                    default: Date.now(),
                }
            }
        ],
        code: [
            {
                xml: {type:String},
                css: {type:String},
                js: {type:String}
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Room', roomSchema, 'rooms');