require('dotenv').config({ path: "./.env" })
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
var bodyParser = require('body-parser')

// define a port the app will be listening on
const port = 5000;

// check for JWT secret key
if (!process.env.JWT_TOKEN_SECRET) {
    throw new Error("JWT_TOKEN_SECRET must be present in the .env file!")
}

// import routes
const userRoute = require('./routes/user')

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// use routes
app.use('/user', userRoute);



app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
});