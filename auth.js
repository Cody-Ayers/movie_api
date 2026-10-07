const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
}

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Email,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken({ _id: user._id, Username: user.Username, Email: user.Email });
                return res.json({ user, token });
            });
        })(req, res);
    });
}