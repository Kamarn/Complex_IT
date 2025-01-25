const mysql = require('mysql');
require('dotenv').config({ path: '../../.env' });

var ordersDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_ORDERS
});

var productsDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_PRODUCTS
});

ordersDB.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to orders database");
    }
});

productsDB.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to products database");
    }
});

exports.display = async (req, res, next) => {
    productsDB.query('SELECT * FROM Product', async (error, result) => {
        if(error){
            console.log(error);
        }

        res.render('index', { products: result, user: req.user });
    });
}

exports.productinfo = async (req, res, next) => {
    const productName= req.params.productName;

    productsDB.query('SELECT * FROM Product WHERE productName = ?', [productName], async (error, result) => {
        if(error){
            console.log(error);
        }

        res.render('productinfo', { product: result, user: req.user });
    });
}

exports.displayforadmin = async (req, res, next) => {

    if( (req.user) && req.usertype == 'manager' ) {
        productsDB.query('SELECT * FROM Product', async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0 ){
                var displayforadmin = true;
            }
    
            res.render('product', { products: result, user: req.user, crud: displayforadmin });
        });
    } else {
        res.redirect('/login');
    }    
}

exports.delete = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        const productID = req.params.productID;
        productsDB.query('DELETE FROM product WHERE productID = ?', [productID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });
        res.redirect('/product/crud');

    } else {
        res.redirect('/login');
    }

}

exports.displaySelected = (req, res) => {
    
    const productID = req.params.productID;

    productsDB.query('SELECT * FROM product WHERE productID = ?', [productID], async (error, result) => {
        if(error){
            console.log(error);
        }
        res.render('updateProduct', { result, user: req.user });
    });
}

exports.update = (req, res) => {
    

    if( (req.user) && req.usertype == 'manager' ) {

        const{productName, productPrice, productQuantity, productID} = req.body;

        productsDB.query("UPDATE product SET productName = ?, productPrice = ?, productQuantity = ? WHERE productID = ?", [productName, productPrice, productQuantity, productID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });
        res.redirect('/product/crud');

    } else {
        res.redirect('/login');
    }

}

exports.buy = async (req, res) => {
    const userID = req.user.userID;

    ordersDB.query('SELECT productID, quantity FROM Cart WHERE userID = ?', [userID], async (error, cartItems) => {
        if (error) {
            console.log(error);
            return res.render('cart', { user: req.user, messageError: "An error occurred fetching cart items." });
        }

        for (const item of cartItems) {
            productsDB.query('SELECT productName, productPrice FROM Product WHERE productID = ?', [item.productID], async (prodError, prodResult) => {
                if (prodError) {
                    console.log(prodError);
                } else {
                    const productDetails = prodResult[0];
                    ordersDB.query('INSERT INTO Orders (userID, productID, productName, productPrice, productQuantity) VALUES (?, ?, ?, ?, ?)', 
                        [userID, item.productID, productDetails.productName, productDetails.productPrice, item.quantity], async (orderError, orderResult) => {
                            if (orderError) {
                                console.log(orderError);
                            }
                        });
                }
            });
        }

        for (const item of cartItems) {
            productsDB.query('UPDATE Product SET productQuantity = productQuantity - ? WHERE productID = ?', [item.quantity, item.productID], async (updateError, updateResult) => {
                if(updateError){
                    console.log(updateError);
                }
            });
        }

        ordersDB.query('DELETE FROM Cart WHERE userID = ?', [userID], async (deleteError, deleteResult) => {
            if (deleteError) {
                console.log(deleteError);
                return res.render('cart', { user: req.user, messageError: "An error occurred clearing the cart." });
            }
            res.render('cart', { user: req.user, messageSuccess: "Successful purchase" });
        });
    });
};