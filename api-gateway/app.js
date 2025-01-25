const path = require('path');
const express = require('express');
const cookieparser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiRoutes = require('./src/routes/apiRoute');
require('dotenv').config();
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../partials');
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const publicDirectory = path.join(__dirname, '../public');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');
app.use(cors());
app.use(express.json());
app.use(cookieparser());

app.use('/', apiRoutes);
app.use('/auth', proxy("http://localhost:5001"));
app.use('/manager', proxy("http://localhost:5003"));
app.use('/worker', proxy("http://localhost:5002"));
app.use('/customer', proxy("http://localhost:5004"));
app.use('/meet', require('./src/routes/apiRoute'));
app.use('/product', proxy("http://localhost:5005"));
app.use("/cart", proxy("http://localhost:5006"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});