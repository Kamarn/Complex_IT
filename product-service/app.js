const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const productRoutes = require('./src/routes/productRoute');
const path = require('path');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../partials');

require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());
app.set('view engine', 'hbs');

app.use('/', productRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));