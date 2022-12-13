const router = require('express').Router();
const roomsController = require('./controllers/roomsController');




router.put("/api/XMLCodes", roomsController.XMLcodes)
router.put("/api/CSSCodes", roomsController.CSScodes)
router.put("/api/JSCodes", roomsController.JScodes)

router.get("/api/getAllCodes/:roomId", roomsController.getAllCodes)

module.exports = router;