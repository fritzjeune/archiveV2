const express = require("express");
const ejs = require("ejs");

const routes = require('./route');

const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);

    next();
};

app.use(logger);
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/statics'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', routes);

app.listen(8002, () => {
    console.log(`App is Running on Port 8001`);
});