const jwt = require('jsonwebtoken');

module.exports.isAuthorized = async function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return null;
    }

    jwt.verify(token, 'ddosproject', async (err, decoded) => {
        if (err) {
            return null;
        }

        sql.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (results.length === 0) {
                return null;
            }

            req.user = { username: results[0].username, name: results[0].name, email: results[0].email };
            return req.user;
        });        
    });
};