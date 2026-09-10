import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// creating token
const createToken = (id,email)=> {
    if(!process.env.JWT_SECRET_KEY) {
        throw new Error("Secret key is missing");
    }
    return jwt.sign({id,email},process.env.JWT_SECRET_KEY,{expiresIn: '1h'});
}

// optional field of cookie
const cookieOptional = {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000,
}

// signin code
export const signin = async (req,res)=> {

    try {
        const { name, age, email, password } = req.body ;

        // checking is all mandatory data are present or not
        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Incomplete information"
            });
        }

        // checking is the user already signin or not
        const user = await User.findOne({ email: email });
        if(user) {
            return res.status(409).json({
                message: "Invalid request"
            });
        }

        // hashing the password
        const hashPassword = await bcrypt.hash(password,12);

        // creating a new user 
        const newUser = await User.create({
            name:name,
            age: age,
            email: email,
            password: hashPassword
        });

        const token = createToken(newUser._id,email);

        res.cookie("token",token,cookieOptional);

        res.status(201).json({
            message: "User created successfully",
            name,
            email,
            tokenUse: newUser.tokenUse,
            tokenLimit: process.env.TOKEN_LIMIT
        });
    
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }

}

//login code
export const login = async (req,res)=> {
    try {

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Incomplete information"
            });
        }

        const user = await User.findOne({email:email});

        if(!user) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        const token = createToken(user._id, email);
        res.cookie("token", token, cookieOptional);

        res.status(200).json({
            message: "User logged in successfully",
            name: user.name,
            email: user.email,
            totalTokenUses: user.totalTokenUses
        });
        
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//profile 
export const profile = async (req,res)=> {
    try {

        res.status(200).json({
            message: "User found",
            user: req.user
        })

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//logout
export const logout = async (req,res)=> {
    try {

        res.clearCookie("token",{httpOnly:true,secure:false});
        res.status(200).json({
            message: "User logged out successfully"
        })

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}