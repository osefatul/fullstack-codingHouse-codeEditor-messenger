const RoomDto = require('../dtos/roomDto');
const roomService = require('../services/roomService');




class RoomsController {
    
    async create(req, res) {
        // room
        const { topic, roomType } = req.body;

        if (!topic || !roomType) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }
        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id,
        });

        return res.json(new RoomDto(room));
    }


    async index(req, res) {
        // const rooms = await roomService.getAllRooms(['open', 'private', 'social']);
        const rooms = await roomService.getAllRooms(
            {userId:req.params.userId,
            types:['open', 'social', 'private']});

        const allRooms = rooms.map((room) => new RoomDto(room));

        //Filtered those private rooms from users that did not belong to them
        const filteredRooms = allRooms.filter( room => {
            if(room.roomType === "private"  && room.ownerId.id === req.params.userId){
                return room
            }
            
            if(room.roomType === 'open'){
                return room
            }
            
        })

        console.log("Starts from here", filteredRooms)

        return res.json(filteredRooms);
    }

    async roomTypes(req, res) {
        // const rooms = await roomService.getAllRooms(['open', 'private', 'social']);
        const rooms = await roomService.getSpecificRooms({userId:req.params.userId, roomType:req.query.roomType});
        const allRooms = rooms.map((room) => new RoomDto(room));
        return res.json(allRooms);
    }

    async show(req, res) {
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }

    
}

module.exports = new RoomsController();