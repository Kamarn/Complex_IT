const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const workerRoutes = require('./src/routes/workerRoute');
const path = require('path');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../partials');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'hbs');

app.use('/', workerRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Worker Service running on port ${PORT}`));