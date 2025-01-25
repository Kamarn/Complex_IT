const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoute');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../partials');
require('dotenv').config();
const path = require('path');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, '../views'));


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Auth Service listening on port ${PORT}`));