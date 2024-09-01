const { login, AdminLogin } = require('../services/auth')

async function handleLogin(req, res) {
    try {
        const loginRes = await login(req.body)
        if (loginRes.err) {
            return res.status(loginRes.status).send(loginRes)
        } else {
            res.cookie('token', loginRes.token, { httpOnly: true,  SameSite: 'None', secure: true});
            res.status(200).send(loginRes)
        }
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
}

async function handleAdminLogin(req, res) {
    try {
        const loginRes = await AdminLogin(req.body)
        if (loginRes.err) {
            return res.status(loginRes.status).send(loginRes)
        } else {
            res.cookie('token', loginRes.token, { httpOnly: true,  SameSite: 'None', secure: true});
            res.status(200).send(loginRes)
        }
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
}

module.exports = { handleLogin, handleAdminLogin }