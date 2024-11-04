const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sql = require('./pool');

router.get('/', async (req, res) => {
    res.status(200).send('Welcome Back');
});

/* User Section */

router.post('/register', async (req, res) => {
    const {username, email, password} = req.query;
    if (!username || !email || !password) { res.status(400).send('Needed All Credentials.'); return false; }
    try {
        sql.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
            if (err) { res.status(500).send('An Error Occurred.'); return false; }
            if (results.length > 0) { res.status(400).send("Can't Create User With That Username."); return false; }
            const cipherPassword = await bcrypt.hash(password, 10);
            const createdUser = sql.query(`INSERT INTO users (username, email, password) VALUES (?,?,?)`, [username, email, cipherPassword]);
            if (!createdUser.values) { res.status(400).send('An Error Occurred.'); return false; }
            res.status(200).send('User Registered Successfully.');
        });    
    } catch (error) {
        res.status(500).send('An Error Occurred: ' + error); return false;
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.query;
    if (!username || !password) { res.status(400).send('Invalid Credentials.'); return false; }
    try {
        sql.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) { res.status(500).send('An Error Occurred.'); return false; }
            if (results.length === 0) { res.status(400).send('Invalid Credentials.'); return false; }
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) { res.status(400).send('Invalid Credentials.'); return false; }
            res.status(200).send('Credentials Approved!');
        });
    } catch (error) {
        res.status(500).send('An Error Occurred: ' + error); return false;
    }
});

router.delete('/delUser', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) { res.status(400).send('Invalid Credentials.'); return false; }
    const user = sql.query(`SELECT * FROM users WHERE username = ${username}`);
    if (!user) { res.status(400).send('Invalid Credentials.'); return false; }
    const matchPassword = bcrypt.compare(password, user.password);
    if (!matchPassword) { res.status(400).send('Invalid Credentials.'); return false; }
    const delUser = sql.query(`DELETE * FROM users WHERE username = ${username}`);
    if (!delUser) { res.status(400).send('An Error Occurred.'); return false; }
    res.status(200).send('User Deleted Successfully.');
    res.redirect('/login');
});

module.exports = router;