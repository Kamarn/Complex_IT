const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const authController = require('../middlewares/workerMiddleware');

router.get('/display', authController.isLoggedIn, workerController.display);
router.get('/displaySelected/:email', authController.isLoggedIn, workerController.displaySelected);
router.post('/update/:email', authController.isLoggedIn, workerController.update);

module.exports = router;