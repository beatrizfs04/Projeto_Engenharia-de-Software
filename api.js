const express = require('express');
const app = express();
var api = express.Router();
const bcrypt = require('bcrypt');
const sql = require('./pool');
const mail = require('./mail');
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
    if (!fullname || !email || !password) { return res.status(400).send('Needed All Credentials.'); }
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

api.post('/password-reset/', async (req, res) => {
    const email = req.query && req.query.email ? req.query.email : null;
  
    if (!email) return res.status(400).send('Email é obrigatório.'); 
  
    sql.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) { res.status(500).send('An Error Occurred.'); }
        if (results.length > 0) {
            const resetToken = await mail.generateToken();
            const updatedUser = sql.query(`UPDATE users SET resettoken = ? WHERE email = ?`, [resetToken, email]);
            if (!updatedUser.values) { return res.status(400).send('An Error Occurred.'); }

            try {
              await mail.sendPasswordResetEmail(email, resetToken);
              return res.status(200).send('Email Enviado');
            } catch (error) {
              console.error('Erro ao enviar email:', error);
              return res.status(500).send('Erro ao enviar o email de recuperação.');
            }
        }
        return res.status(400).send('Email Não Encontrado.'); 
    });

    
});  

api.post('/update/', async (req, res) => {
    const token = req.query && req.query.token ? req.query.token : null;
    const password = req.query && req.query.password ? req.query.password : null;
  
    if (!token) return res.status(400).send('Token é obrigatório.'); 
  
    sql.query('SELECT * FROM users WHERE resettoken = ?', [token], async (err, results) => {
        if (err) { res.status(500).send('An Error Occurred.'); }
        if (results.length > 0) {
            console.log(results);
            const cipherPassword = await bcrypt.hash(password, 10);
            const updatedUser = sql.query(`UPDATE users SET password=?,resettoken=? WHERE resettoken=?`, [cipherPassword, "", token]);
            if (!updatedUser.values) { return res.status(400).send('An Error Occurred.'); }
            return res.status(200).send('User Registered Successfully.');
        }
        return res.status(400).send('Email Não Encontrado.'); 
    });
});  

api.get('/hotels/', async (req, res) => {
    sql.query('SELECT * FROM hotels', [], async (err, results) => {
        if (err) { res.status(500).send('An Error Occurred.'); }
        if (results.length > 0) {
            return res.status(200).json(JSON.parse(JSON.stringify(results)));
        }
        return res.status(400).send('Email Não Encontrado.'); 
    });
})

module.exports = api;