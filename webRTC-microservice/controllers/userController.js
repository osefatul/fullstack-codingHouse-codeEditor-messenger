const UserModel = require('../models/userModel');


class UpdateUser {

    async updateAvatar(req, res, next) {
        const update = await UserModel.updateMany({}, { $set: {avatar: "https://res.cloudinary.com/ddgn3r0t2/image/upload/v1671431747/codingHouse/ealsw8btdpfkg1vyrhia.jpg"}})
        res.json({message:"updated", update})
    }

}


module.exports = new UpdateUser(); //singleton pattern 