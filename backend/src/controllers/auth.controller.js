const userModel = require("../models/user.model");
const foodPartnerModel= require("../models/foodpartner.model");
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const { model } = require("mongoose");

async function registerUser(req,res) {
    const {fullName, email, password} = req.body; // we have given the middel where to read it
    
    const isuserAlreadyExists = await userModel.findOne({
        email
    })
    if(isuserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName,
        email,
        password:hashedPassword
    })

    const token = jwt.sign({
        id:user._id,

    },process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(201).json({
        message:"User register successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })
} 

async function loginUser(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({
        email
    })
    if(!user){
        res.status(400).json({
            message: "Invalid email  or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        res.status(400).json({
            message: "Invalid email  or password"
        })
    }

    const token =jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token);
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })

}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out successfully"
    });
}

async function registerFoodPartner(req, res) {
    try {
        const { name, email, password,phone,address,contactName } = req.body;

        const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
        if (isAccountAlreadyExists) {
            return res.status(400).json({
                message: "Food partner account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        });

        const token = jwt.sign(
            { id: foodPartner._id },
            process.env.JWT_SECRET
        );

        res.cookie("token");

        res.status(201).json({
            message: "Food partner registered successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                contactName:foodPartner.contactName,
                address:foodPartner.address,
                phone:foodPartner.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function loginFoodPartner(req,res){
    const {email, password}=req.body;

    const footPartner = await foodPartnerModel.findOne({
        email
    })

    if(!footPartner){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,footPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id : footPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(200).json({
        message: "Food partner logged in successfully",
        footPartner:{
            _id:footPartner._id,
            email:footPartner.email,
        }
    })

}

function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"Food partner logged out successfully"
    })
}

module.exports = {  
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};  