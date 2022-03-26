// jshint esversion: 9

const express = require('express' );
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//load env files 
dotenv.config();

connectDB();

// routes files 
const assurees = require('./routes/assurees');
const enterprises = require('./routes/enterprises');
// const statusScanned = require('./routes/statusScanned');
const prets = require('./routes/pret');
const works = require('./routes/works');
const requestforms = require('./routes/requestforms');
const auth = require('./routes/auth');
const credit = require('./routes/credit-app')
const cookieParser = require('cookie-parser');

const app = express({ strict: true });
// { strict: true }


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/statics'));


const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);

    next();
};

app.use(logger);
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/ona-front-node/views');

// mount routes for api
app.use('/api/v1/assurees', assurees);
app.use('/api/v1/enterprises', enterprises);
app.use('/api/v1/works', works);
app.use('/api/v1/requestforms', requestforms);
app.use('/api/v1/auth', auth);
app.use('/api/v1/pret', prets);



app.use('/', credit);





const PORT = process.env.PORT || 3031;

const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

//handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close the server and exit process
    server.close(() => process.exit(1));
});