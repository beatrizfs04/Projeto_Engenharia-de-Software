/* Requirements */
const path = require('path');
const express = require('express');
const app = express();
const routes = require('./routes');

/* WEB */
app.get('/', function(req, res) { res.sendFile(path.join(__dirname, '/web/index.html')) });
app.get('/login', function(req, res) { res.sendFile(path.join(__dirname, '/web/login.html')) });
app.get('/register', function(req, res) { res.sendFile(path.join(__dirname, '/web/register.html')) });
app.get('/dashboard', function(req, res) { res.sendFile(path.join(__dirname, '/web/dashboard.html')) });
app.get('/profile', function(req, res) { res.sendFile(path.join(__dirname, '/web/profile.html')) });
app.get('/status', function(req, res) { res.sendFile(path.join(__dirname, '/web/status.html')) });
app.get('/check-service', function(req, res) { res.sendFile(path.join(__dirname, '/web/check-service.html')) });

/* API */
app.use('/api/', routes);
app.use('/styles', function(req, res) { res.sendFile(path.join(__dirname, '/web/styles.css')) });
app.use('/scripts', function(req, res) { res.sendFile(path.join(__dirname, '/web/script.js')) });


/* ON LOAD */
app.listen(5173, () => { console.log(`> http://localhost:5173`) });
