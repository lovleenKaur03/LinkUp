const express = require("express");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js");
const experienceRoutes = require("./routes/experience.js");
const skillRoutes = require("./routes/skill.js");
const projectRoutes = require("./routes/project.js");
const User = require("./models/User.js");
require("dotenv").config();

const app = express();
app.use(express.json());

//connect to monogodb from node we need to use mongoose.connect()
//it takes 1. connection string 2. connection object
mongoose
  .connect(
    "mongodb+srv://lovleen:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.5debyau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log("Connected to mongo");
  })
  .catch((err) => {
    console.log("Error connecting to mongo");
    console.log(err);
  });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secretKey1207";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      if (err) {
        done(err, false);
      }
    }
  })
);

app.get("/", (req, res) => {
  res.send("Working");
});

//takes two params, prefix to the route(eg, auth/ or /skills) and routes object
app.use("/auth", authRoutes);
app.use("/experience", experienceRoutes);
app.use("/skill", skillRoutes);
app.use("/project", projectRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
