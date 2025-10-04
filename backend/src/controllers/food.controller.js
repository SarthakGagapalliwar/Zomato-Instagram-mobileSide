const foodModel = require('../models/food.model');
const storageServices = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    try {
        console.log(req.foodPartner);
        console.log(req.body);
        console.log(req.file); 

        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        const fileUploadResult = await storageServices.uploadFile(req.file.buffer, uuid()); 
        
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodpartner: req.foodPartner._id
        });

        return res.status(201).json({
            message: "food created successfully",
            food: foodItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}


async function getFoodItems(req,res){
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message:"Food items fetched successfully",
        foodItems
    })
}

module.exports = {
    createFood,
    getFoodItems
};
