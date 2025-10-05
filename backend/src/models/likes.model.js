const mongoose = require("mongoose");

const likeSchme = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'actorModel',
        required: true
    },
    actorModel: {
        type: String,
        enum: ["user", "foodPartner"],
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }

}, {
    timestamps: true
})

likeSchme.index({ actor: 1, actorModel: 1, food: 1 }, { unique: true });

const Like = mongoose.model('like', likeSchme);
module.exports = Like;