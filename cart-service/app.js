const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cartRoutes = require('./src/routes/cartRoute');
const path = require('path');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../partials');

require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'hbs');

app.use('/', cartRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));