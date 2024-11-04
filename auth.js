const express = require('express');
const app = express();
var auth = express.Router();
var functions = {};

auth.post('/google/', async(req, res) => {
    console.log("User Trying to Login With Google.");
});

auth.post('/facebook/', async(req, res) => {
    console.log("User Trying to Login With Facebook.");
});

module.exports = auth;