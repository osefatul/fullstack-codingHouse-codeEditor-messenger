const RoomModel = require('../models/roomModel');


class RoomsController {
    
    async XMLcodes(req, res) {
        console.log(req.body)
        const updateRoom = await RoomModel.findByIdAndUpdate(
            {_id: req.body.roomId},
            {
                "$set": {"code.0.xml": req.body.xml}
            },
            {new: true}
        )
        res.status(200).json({message:"Code Updated", updateRoom})
    }



    async CSScodes(req, res) {
        console.log(req.body)
        const updateRoom = await RoomModel.findByIdAndUpdate(
            {_id: req.body.roomId},
            {
                "$set": {"code.0.css": req.body.css}
            },
            {new: true}
        )
        res.status(200).json({message:"Code Updated", updateRoom})
    }


    async JScodes(req, res) {
        console.log(req.body)
        const updateRoom = await RoomModel.findByIdAndUpdate(
            {_id: req.body.roomId},
            {
                "$set": {"code.0.js": req.body.js}
            },
            {new: true}
        )
        res.status(200).json({message:"Code Updated", updateRoom})
    }


    async getAllCodes (req, res) {
        const updateRoom = await RoomModel.findById(
            {_id: req.params.roomId}
        )
        res.status(200).json({message:"Code Updated", updateRoom})
    }
}

module.exports = new RoomsController();