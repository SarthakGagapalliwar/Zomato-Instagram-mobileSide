const mongoose = require("mongoose");

const likeSchme = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'food',
        required:true
    }

},{
    timeseries:true
})

const Like = mongoose.model('like',likeSchme);
module.exports =Like;