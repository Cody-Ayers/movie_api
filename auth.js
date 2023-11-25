const jwtSecret = 'your_jwt_secret'; // Needs to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //Local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //Username you're encoding in the JWT
        expiresIn: '7d', // Specifies when token expires (i.e. 7 days)
        algorithm: 'HS256' // Algorithm used to "sign" or encode the values of JWT
    });
}

/* POST Login */
module.exports = (router) => {
    router.post('./login', (req, res) => {
        passport.authenticate('local', {session: false}, (error,user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}