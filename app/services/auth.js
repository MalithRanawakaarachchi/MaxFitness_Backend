const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY
const { getUserByEmail, getTraineeByEmail } = require('../models/users')

const bcrypt = require('bcrypt');

async function comparePasswords(inputPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(inputPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

const Authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) {
        return res.status(401).send({ message: 'unauthorized' })
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized' })
        }
        req.user = user;
        next();
    });
};

async function login(body) {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            const user = await getTraineeByEmail(email);
            const passwordMatch = await comparePasswords(password, user.password);
            if (passwordMatch) {
                if (user.user_level == 100) {
                const token = jwt.sign(user, secretKey);
                resolve({ token: token, err: false, status: 200, user: user });
                }else{
                    resolve({ status: 401, err: true, msg: 'Invalid credentials' });
                }
            } else {
                resolve({ status: 401, err: true, msg: 'Invalid credentials' });
            }
        } catch (error) {
            reject(error);
        }
    });
}


async function AdminLogin(body) {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            const user = await getUserByEmail(email);
            const passwordMatch = await comparePasswords(password, user.password);
            if (passwordMatch) {
                if (user.user_level > 999) {
                    const token = jwt.sign(user, secretKey);
                    resolve({ token: token, err: false, status: 200, user: user });
                }else{
                    resolve({ status: 401, err: true, msg: 'Invalid credentials' });
                }
            } else {
                resolve({ status: 401, err: true, msg: 'Invalid credentials' });
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { login, Authenticate, AdminLogin }