const jwt = require("jsonwebtoken");
exports = {};

exports.getToken = (email, user)=>{
    const token = jwt.sign({identifier: user._id}, "secretKey1207");
    return token;
};

module.exports = exports;