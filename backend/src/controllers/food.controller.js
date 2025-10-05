const foodModel = require('../models/food.model');
const storageServices = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
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

async function likeFoodCountControler(req,res){
    const {foodId} = req.body;

    const user = req.user;
    const isAlreadyLiked = await likeModel.findOne({
        user:user._id,
        food:foodId
    })
    if(isAlreadyLiked){
        await likeModel.deleteOne({
            user:user._id,
            food:foodId
        })
        await foodModel.findByIdAndUpdate(foodId,{
            $inc:{likeCount: -1}
        })
        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user:user._id,
        food:foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
            $inc:{likeCount: 1}
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}


async function saveFood(req,res){
    const {foodId} = req.body;

    const user = req.user;
    const isAlreadySaved = await saveModel.findOne({
        user:user._id,
        food:foodId
    })
    if(isAlreadySaved){
        await saveModel.deleteOne({
            user:user._id,
            food:foodId
        })
        return res.status(200).json({
            message: "Food unsave successfully"
        })
    }

    const save = await saveModel.create({
        user:user._id,
        food:foodId
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

module.exports = {
    createFood,
    getFoodItems,
    likeFoodCountControler,
    saveFood
};
