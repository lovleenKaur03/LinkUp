const express = require("express");
const passport= require("passport");
const Experience = require("../models/Experience");
const router = express.Router();


router.post("/create",passport.authenticate("jwt",{session:false}),
 async (req,res)=>{
    //1. identify the user who is calling it
    //due to passport.autheniticate(), req.user will get populated with the current user details
    const user= req.user;

    //2. create experience object
    const {companyName, position, startDate,endDate,description} = req.body;
    if(!companyName || !position){
        return res.status(402).json({err:"Invalid details"});
    }
    const experienceObj = {companyName, position, startDate, endDate, description};
    const experience = await Experience.create(experienceObj);
    
    //3. add experience to user
    // the experiences field of my user will hold the id's of all my users
    user.experiences.push(experience._id);
    await user.save();

    //4. Return a response
    return res.status(200).json(experience);
});

module.exports = router;


