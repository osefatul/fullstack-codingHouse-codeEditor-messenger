const RoomModel = require('../models/roomModel');


class RoomsController {
    
    async update(req, res) {
        console.log(req.body)
        const updateRoom = await RoomModel.findByIdAndUpdate(
            {_id: req.body.roomId},
            {
                $push: {
                    conversation: {
                        message: req.body.message,
                        sender: req.body.sender
                    }
                }
            },
            {new: true}
        )

        res.status(200).json({message:"Chat Updated", updateRoom})
    }
}

module.exports = new RoomsController();