const router = require('express').Router();
const roomsController = require('./controllers/roomsController');




router.put("/api/updateRoom", roomsController.update)
module.exports = router;