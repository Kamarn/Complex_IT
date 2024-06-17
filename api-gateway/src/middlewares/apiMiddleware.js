const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();

const jwt_pass = 'cookiepass';

var database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_USERS
});

database.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to user database");
    }
});


exports.isLoggedIn = async (req, res, next) => {
    if( req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, jwt_pass);
  
            database.query('SELECT * FROM users WHERE username = ?', [decoded.id], (error, result) => {
                if(!result) {
                return next();
                }

                req.user = result[0];
                req.usertype = result[0].usertype;
                req.username = result[0].username;
                return next();
    
            });
        }catch(error){
            console.log(error);
            return next();
        }
    }else{
        next();
    }
}