const jwt = require("jsonwebtoken");
const User= require("../models/User");
const bcrypt = require("bcryptjs");


const registerUser=async(req,res) => {
   try {
    const {name,email,password,confirmPassword,role}=req.body;
    if(!name || !email || !password || !confirmPassword) 
        return res.status(400).json({message: "all fields are required"})
    
    if(password!==confirmPassword) 
        return res.status(400).json({ message: "Passwords do not match" });

    const alreadyUser= await User.findOne({email})
    if(alreadyUser) {
        return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword= await bcrypt.hash(password,10);



    const newUser= new User({
        name,
        email,
        password:hashedPassword,
        role: role || 'employee'

    })
    await newUser.save();


    res.status(201).json({ message: "User created successfully",user: newUser });


    
   } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
    
   }
}
//login User
const loginUser=async(req,res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user= await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token= jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"2h"});
        res.status(200).json({token, user});

        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error logging in user" });


        
    }
}

















module.exports={registerUser,
    loginUser};




