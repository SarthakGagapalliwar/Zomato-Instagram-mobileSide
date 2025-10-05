const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const foodController = require("../controllers/food.controller")
const multer = require('multer') // to read the file like video image and all

const upload = multer({
    storage: multer.memoryStorage(),
})

/* POST /api/food/ [protected] */
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood); //by next() it will goes to foodController.createFood



/* GET /api/food [protected]*/  //users
router.get("/", authMiddleware.authAccountMiddleware,
    foodController.getFoodItems
)


router.post('/like',
    authMiddleware.authAccountMiddleware,
    foodController.likeFoodCountControler)

router.post('/save',
    authMiddleware.authAccountMiddleware,
    foodController.saveFood
)

module.exports = router;
