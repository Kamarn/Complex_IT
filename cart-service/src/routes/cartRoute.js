const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../middlewares/cartMiddleware');

router.get('/add/:productID', authController.isLoggedIn, cartController.add);
router.get('/remove/:productID', authController.isLoggedIn, cartController.remove);
router.get('/removeOnlyOne/:productID', authController.isLoggedIn, cartController.removeOnlyOne);
router.get('/mycart/', authController.isLoggedIn, cartController.mycart);

module.exports = router;