const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const authController = require('../middlewares/managerMiddleware');


router.get('/display', authController.isLoggedIn, managerController.display);
router.get('/orders', authController.isLoggedIn, managerController.orders);
router.get('/update/:email', authController.isLoggedIn, managerController.update);
router.get('/delete/:email', authController.isLoggedIn, managerController.delete);
router.post('/addnewproduct', authController.isLoggedIn, managerController.addnewproduct);


router.get("/productembed", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'manager' ) {
        res.render("product_embed", { user: req.user});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;