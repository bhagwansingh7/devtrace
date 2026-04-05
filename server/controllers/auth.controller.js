import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
    try {
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message:"User allready registered"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })

        console.log(user.data);
        return res.status(201).json({
            message:"user resistered successfully"
        })
} catch (error) {
    console.log(`error in resistered user ${error}`)
    }
}

export const loginUser = async (req,res)=>{

    try {

        const {email,password} = req.body

        const user = await User.findOne({email}).select("+password")

        

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }



        const isMatch = await bcrypt.compare(password,user.password)
        console.log(isMatch);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        console.log(token);

        res.json({
            message:"Login successful",
            token
        })

    } catch (error) {

        res.status(500).json({
            message:"Server error",error
        })

    }

}

//for logout


