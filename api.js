const express = require('express');
const app = express();
var api = express.Router();
const bcrypt = require('bcrypt');
const sql = require('./pool');
var functions = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

functions.loadPage = function() {
    console.log("> API Loaded.");
}

api.get('/', async(req, res) => {
    functions.loadPage();
});

api.post('/login/', async(req, res) => {
    const email = (req.query && req.query.email ? req.query.email : null);
    const password = (req.query && req.query.password ? req.query.password : null);
    console.log(email, password);
    if (!email || !password) { return res.status(400).send('Invalid Credentials.');}
    try {
        sql.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) { return res.status(500).send('An Error Occurred.'); }
            if (results.length === 0) { return res.status(400).send('Invalid Credentials.'); }
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) { return res.status(400).send('Invalid Credentials.'); }
            const returnUser = {id: user.id, fullname: user.fullname, email: user.email};
            return res.status(200).json({userData: returnUser});
        });
    } catch (error) {
        return res.status(500).send('An Error Occurred: ' + error);
    }
});

api.post('/register/', async(req, res) => {
    const fullname = (req.query && req.query.fullname ? req.query.fullname : null);
    const email = (req.query && req.query.email ? req.query.email : null);
    const password = (req.query && req.query.password ? req.query.password : null);
    console.log(fullname, email, password);
    if (!fullname || !email || !password) { res.status(400).send('Needed All Credentials.'); }
    try {
        sql.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) { res.status(500).send('An Error Occurred.'); }
            if (results.length > 0) { return res.status(400).send("Can't Create User With That E-Mail."); }
            const cipherPassword = await bcrypt.hash(password, 10);
            const createdUser = sql.query(`INSERT INTO users (email, password, fullname) VALUES (?,?,?)`, [email, cipherPassword, fullname]);
            console.log(createdUser.values);
            if (!createdUser.values) { return res.status(400).send('An Error Occurred.'); }
            return res.status(200).send('User Registered Successfully.');
        });    
    } catch (error) {
        return res.status(500).send('An Error Occurred: ' + error);
    }
});

module.exports = api;