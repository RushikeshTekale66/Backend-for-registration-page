const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/RegistrationForm').then(()=>console.log("Database connecteed")).catch((e)=>console.log("Got error ", e));