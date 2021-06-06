const router = require('express').Router();
const User = require('../models/User')
require('dotenv').config({ path: "./.env" })
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

// Model of a user that contains only publicly available properties
class PublicUser {
    userName;
    createdAt;
    admin;
    constructor(user) {
        this.userName = user.userName;
        this.createdAt = user.createdAt;
        this.admin = user.admin;
    }
}


// Get user data
router.get('/:userName?', auth, async (req, res) => {

    // Get user from db if specified in the params else get requesting user
    const user = req.params.userName ? await User.findOne({ where: { userName: req.params.userName } }) : req.user
    if (user) {

        //if requesting user is an admin send whole user object
        // else send only data specified in PublicUser class
        if (req.user.id == user.id || req.user.admin) {
            return res.status(200).send(user);
        } else {
            const publicUser = new PublicUser(user)
            return res.status(200).send(publicUser);
        }

    } else {
        return res.status(400).send("user not found")
    }
})

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        //get login and password from authorization headers
        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

        // get user with matching login
        const user = await User.findOne({ where: { login: login } })

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ ...user }, process.env.JWT_TOKEN_SECRET)
            return res.status(200).send(token);
        } else {
            return res.status(401).send('Username or passwsord incorrect!')
        }
    } catch (err) {
        console.log(err)
        return res.status(401).send('Login failed!');
    }


})


// Registration endpoint
router.post('/register', async (req, res) => {

    // deserialize request body
    const { login, userName, password } = { ...req.body };

    // check if required properties are provided
    if (userName && password && login) {

        // find all users matching prodived username and login 
        const userExists = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        userName: userName
                    },
                    {
                        login: password
                    }
                ]
            }
        })

        // return if user already exists
        if (userExists.length > 0) {
            return res.status(400).send("User already exists");
        }

        const user = await User.create({
            login: login,
            userName: userName,
            password: await bcrypt.hash(password, 10),
            createdAt: new Date(Date.now()),
        })
        await user.save();
        return res.status(200).send(new PublicUser(user));
    } else {
        return res.status(400).send("name and password required")
    }
})

module.exports = router;