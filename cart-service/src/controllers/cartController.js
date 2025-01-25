const mysql = require('mysql');
require('dotenv').config({ path: '../../.env' });

var productDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_PRODUCTS
});

var cartDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_CART
});

cartDB.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to database");
    }
});

exports.mycart = (req, res) => {
    const userID = req.user.userID;
    var totalPrice = 0;

    cartDB.query('SELECT productID, quantity FROM cart WHERE userID = ?', [userID], async (error, cartResults) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error accessing cart data");
        }

        const cartItems = JSON.parse(JSON.stringify(cartResults));
        if (cartItems.length === 0) {
            return res.render('cart', { ans: false, totalPrice, user: req.user });
        }

        let productDetailsPromises = cartItems.map(item => {
            return new Promise((resolve, reject) => {
                productDB.query('SELECT productName, productPrice, productImage FROM Product WHERE productID = ?', [item.productID], (error, productResults) => {
                    if (error) {
                        return reject(error);
                    }
                    const product = JSON.parse(JSON.stringify(productResults))[0];
                    const extendedItem = {
                        ...item,
                        productName: product.productName,
                        productPrice: product.productPrice,
                        productImage: product.productImage,
                        totalPrice: product.productPrice * item.quantity
                    };
                    resolve(extendedItem);
                });
            });
        });

        Promise.all(productDetailsPromises).then(completedItems => {
            completedItems.forEach(item => {
                totalPrice += item.totalPrice;
            });
            res.render('cart', { result: completedItems, ans: true, totalPrice, user: req.user });
        }).catch(error => {
            console.log(error);
            res.status(500).send("Error accessing product data");
        });
    });
};

exports.add = (req, res) => {

    if( req.user ) {
        const userID = req.user.userID;
        const productID= req.params.productID;
        var quantity = 1;

        cartDB.query('SELECT * FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
            if(error){
                console.log(error);
            }
            if(result.length > 0){
                cartDB.query('UPDATE cart SET quantity = quantity + 1 WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
                    if(error){
                        console.log(error);
                    }
                });
                res.redirect('/');
            }
            else{
                cartDB.query('INSERT INTO cart SET ?', {userID: userID, productID: productID, quantity: quantity}, async (error, result) => {
                    if(error){
                        console.log(error);
                    }
                });
                
                res.redirect('/');
            }
        });

    } else {
        res.redirect('/login');
    }
        
}

exports.remove = (req, res) => {

    const userID = req.user.userID;
    const productID= req.params.productID;

    cartDB.query('DELETE FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
        if(error){
            console.log(error);
        }
    });

    res.redirect('/cart/mycart');
}

exports.removeOnlyOne = (req, res) => {

    const userID = req.user.userID;
    const productID= req.params.productID;

    cartDB.query('UPDATE cart SET quantity = quantity - 1 WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
        if(error){
            cartDB.query('DELETE FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
                if(error){
                    console.log(error);
                }
            });
        }
    });

    res.redirect('/cart/mycart');
}