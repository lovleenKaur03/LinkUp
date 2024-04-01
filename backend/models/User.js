const mongoose = require("mongoose");

//1. create schema
//2. Convert the schema to a model

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
    },
    lastName:{
        type: String,
        required: false,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type: String,
        required:true,
    },
    experiences:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Experience",
        },
    ],
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Project",
        },
    ],
    skills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        },
    ],
});

const User = mongoose.model("User",UserSchema);

module.exports = User;