const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("MongoDB connect");
    })
    .catch((err)=>{
        console.log("MongoDB connection error:",err);
    })
}
module.exports = connectDB;