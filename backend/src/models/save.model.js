const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "actorType",
        required: true
    },
    actorType: {
        type: String,
        enum: ["user", "foodPartner"],
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    }
}, {
    timestamps: true
});

saveSchema.index({ actor: 1, actorType: 1, food: 1 }, { unique: true });

const saveModel = mongoose.model("save", saveSchema);

module.exports = saveModel;