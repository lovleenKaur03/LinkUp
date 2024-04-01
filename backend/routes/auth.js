const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  //This function will handle user registration
  //step 1: Get details from req.body

  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ err: "Invalid request body" });
  }

  //step 2: we'll check if a user with email already exist

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(402).json({ err: "User with this email already exists" });
  }
  //step 3: valid user req, create the user

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserDetails = {
    firstName,
    lastName,
    password: hashedPassword,
    email,
  };
  const newUser = await User.create(newUserDetails);

  //step 4: i can use the newUser to create a JWt and return the token to the user.
  const token = await getToken(email, newUser);
  //we want to return the following to the user
  // 1. The actual user created 2. token
  const userToReturn = {...newUser.toJSON(), token};
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post("/login",async (req,res)=>{
    //step 1. we get the details from the body
    const {email,password}=req.body;
    console.log(req.body);
    if (!email || !password){
        return res.status(401).json({err:"Invalid request body"});
    }


    //step 2. verify if the user exists with that email
    const user = await User.findOne({email:email});
    if (!user){
        return res.status(401).json({err:"Invalid Email id"});
    }

    // step 3. verify if the password matches the email respectively
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({err:"Invalid password"});
    }

    //step 4. if everthing's right , generat a token and return it
    const token = await getToken(email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;