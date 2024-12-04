/* Requirements */
const path = require('path');
const express = require('express');
const app = express();
const api = require('./api');
const auth = require('./auth');

/* WEB */
app.get('/', function(req, res) { res.sendFile(path.join(__dirname, '/web/index.html')) });
app.get('/bookmarks', function(req, res) { res.sendFile(path.join(__dirname, '/web/bookmarks/index.html')) });
app.get('/hotels', function(req, res) { res.sendFile(path.join(__dirname, '/web/hotels/index.html')) });
app.get('/events', function(req, res) { res.sendFile(path.join(__dirname, '/web/events/index.html')) });
app.get('/packs', function(req, res) { res.sendFile(path.join(__dirname, '/web/packs/index.html')) });
app.get('/filters', function(req, res) { res.sendFile(path.join(__dirname, '/web/filters/index.html')) });
app.get('/cart', function(req, res) { res.sendFile(path.join(__dirname, '/web/cart/index.html')) });
app.get('/login', function(req, res) { res.sendFile(path.join(__dirname, '/web/login/index.html')) });
app.get('/register', function(req, res) { res.sendFile(path.join(__dirname, '/web/register/index.html')) });
app.get('/profile', function(req, res) { res.sendFile(path.join(__dirname, '/web/profile/index.html')) });
app.get('/forgot', function(req, res) { res.sendFile(path.join(__dirname, '/web/forgot/index.html')) });
app.get('/reset', function(req, res) { res.sendFile(path.join(__dirname, '/web/reset/index.html')) });
app.get('/404', function(req, res) { res.sendFile(path.join(__dirname, '/web/404.html')) });

/* API */
app.use('/api/', api);
app.use('/auth/', auth);
app.use('/logo', function(req, res) { res.sendFile(path.join(__dirname, '/web/tourit-logo.png'));});
app.use('/google', function(req, res) { res.sendFile(path.join(__dirname, '/web/google.png'));});
app.use('/facebook', function(req, res) { res.sendFile(path.join(__dirname, '/web/facebook.png'));});
app.use('/404Img', function(req, res) { res.sendFile(path.join(__dirname, '/web/404.png'));});
app.use('/placeholder', function(req, res) { res.sendFile(path.join(__dirname, '/web/placeholder.png'));});
app.use('/styles', function(req, res) { res.sendFile(path.join(__dirname, '/web/styles.css'));});
app.use('/scripts', function(req, res) { res.sendFile(path.join(__dirname, '/web/scripts.js')) });

app.use((req, res) => {
    res.redirect('/404');
});

/* ON LOAD */
app.listen(5000, () => { console.log(`> http://localhost:5000`) });