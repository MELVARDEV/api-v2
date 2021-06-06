const jwt = require('jsonwebtoken');
require('dotenv').config({ path: "./.env" })
const User = require('../models/User')

// Authentication middleware - Verify JWT 
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET).dataValues;
        const tokenId = decodedToken.id;
        //console.log(decodedToken)
        const user = await User.findOne({ where: { id: tokenId } })
        if (!user) {
            return res.status(401).send("Invalid token id")
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        console.log(err)
        return res.status(401).send("Invalid token!");
    }
};