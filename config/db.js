//jshint esversion:9


const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env files 
dotenv.config();


const localUri = process.env.MONGODB_URI;

const connectDB = async () => {
    const conn = await mongoose.connect(localUri); 

    console.log(`mongoDB ConnecteD: ${conn.connection.host}`);

    
};

module.exports = connectDB;