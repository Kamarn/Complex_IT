const express = require('express');
const cookieParser = require('cookie-parser');
const managerRoutes = require('./src/routes/managerRoute');
const path = require('path');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
hbs.registerPartials(__dirname + '/../partials');

require('dotenv').config();

const app = express();

const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended: false}));
app.set('views', path.join(__dirname, '../views'));
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());
app.use(fileUpload());
app.set('view engine', 'hbs');

app.use('/', managerRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Manager Service running on port ${PORT}`));