const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authController = require('../middlewares/customerMiddleware');

router.get('/orders', authController.isLoggedIn, customerController.orders);


module.exports = router;