import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";


const authUserMiddleware = async (req,res,next)=> {
    try{

        const { token } = req.cookies ;

        if(!token) {
            return res.status(401).json({
                message: "invalid token"
            });
        }

        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);

        const user = await User.findById(payload.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user ;

        next();

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default authUserMiddleware;