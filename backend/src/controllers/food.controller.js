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


async function getFoodItems(req, res) {
    try {
        const account = req.account ?? (req.user ? { id: req.user._id, type: "user" } : req.foodPartner ? { id: req.foodPartner._id, type: "foodPartner" } : null);

        const [foods, likedDocs, savedDocs] = await Promise.all([
            foodModel.find({}).lean(),
            account ? likeModel.find({ actor: account.id, actorModel: account.type }).select('food').lean() : [],
            account ? saveModel.find({ actor: account.id, actorModel: account.type }).select('food').lean() : []
        ]);

        const likedSet = new Set((likedDocs ?? []).map((doc) => doc.food.toString()));
        const savedSet = new Set((savedDocs ?? []).map((doc) => doc.food.toString()));

        const foodItems = foods.map((food) => ({
            ...food,
            likeCount: food.likeCount ?? 0,
            savesCount: food.savesCount ?? 0,
            liked: likedSet.has(food._id.toString()),
            saved: savedSet.has(food._id.toString()),
        }));

        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems
        });
    } catch (error) {
        console.error('Failed to fetch food items:', error);
        res.status(500).json({
            message: "Unable to fetch food items",
            error: error.message
        });
    }
}

async function likeFoodCountControler(req, res) {
    try {
        const { foodId } = req.body;
        const account = req.account ?? (req.user ? { id: req.user._id, type: "user" } : req.foodPartner ? { id: req.foodPartner._id, type: "foodPartner" } : null);

        if (!account) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const isAlreadyLiked = await likeModel.findOne({
            actor: account.id,
            actorModel: account.type,
            food: foodId
        });

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                actor: account.id,
                actorModel: account.type,
                food: foodId
            });

            const updatedFood = await foodModel.findByIdAndUpdate(
                foodId,
                { $inc: { likeCount: -1 } },
                { new: true, projection: { likeCount: 1, savesCount: 1 } }
            );

            return res.status(200).json({
                message: "Food unliked successfully",
                liked: false,
                likeCount: Math.max(0, updatedFood?.likeCount ?? 0)
            });
        }

        await likeModel.create({
            actor: account.id,
            actorModel: account.type,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { likeCount: 1 } },
            { new: true, projection: { likeCount: 1, savesCount: 1 } }
        );

        return res.status(201).json({
            message: "Food liked successfully",
            liked: true,
            likeCount: Math.max(0, updatedFood?.likeCount ?? 0)
        });
    } catch (error) {
        console.error('Failed to toggle like:', error);
        return res.status(500).json({
            message: "Unable to toggle like",
            error: error.message
        });
    }
}


async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const account = req.account ?? (req.user ? { id: req.user._id, type: "user" } : req.foodPartner ? { id: req.foodPartner._id, type: "foodPartner" } : null);

        if (!account) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const isAlreadySaved = await saveModel.findOne({
            actor: account.id,
            actorModel: account.type,
            food: foodId
        });

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                actor: account.id,
                actorModel: account.type,
                food: foodId
            });

            const updatedFood = await foodModel.findByIdAndUpdate(
                foodId,
                { $inc: { savesCount: -1 } },
                { new: true, projection: { savesCount: 1, likeCount: 1 } }
            );

            return res.status(200).json({
                message: "Food unsaved successfully",
                saved: false,
                savesCount: Math.max(0, updatedFood?.savesCount ?? 0)
            });
        }

        await saveModel.create({
            actor: account.id,
            actorModel: account.type,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { savesCount: 1 } },
            { new: true, projection: { savesCount: 1, likeCount: 1 } }
        );

        return res.status(201).json({
            message: "Food saved successfully",
            saved: true,
            savesCount: Math.max(0, updatedFood?.savesCount ?? 0)
        });
    } catch (error) {
        console.error('Failed to toggle save:', error);
        return res.status(500).json({
            message: "Unable to toggle save",
            error: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFoodCountControler,
    saveFood
};
