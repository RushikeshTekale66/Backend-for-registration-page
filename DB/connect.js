const mongoose = require('mongoose');
require('dotenv').config();
const DatabaseUrl = process.env.DATABASEURL;

try{
    mongoose.connect(DatabaseUrl);
    console.log("Connected to database");
}
catch(error){
    console.log("Unable to connect database");
}