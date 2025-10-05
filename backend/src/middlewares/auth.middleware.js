const { model } = require("mongoose");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner account not found"
            })
        }

        req.foodPartner = foodPartner; // in req we are creting me req property of foodparther
        req.account = {
            id: foodPartner._id,
            type: "foodPartner"
        };

        next()
    } catch {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            })
        }

        req.user = user;
        req.account = {
            id: user._id,
            type: "user"
        };
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

}

async function authAccountMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            req.account = {
                id: user._id,
                type: "user"
            };
            return next();
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            req.account = {
                id: foodPartner._id,
                type: "foodPartner"
            };
            return next();
        }

        return res.status(401).json({
            message: "Account not found"
        })
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    authAccountMiddleware
}