const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { add, update, checkEmailAvailability, getUserById } = require("../models/users");

async function handleAddUser(req, res) {
    try {
        const user = req.body;
        const isEmailAvailable = await checkEmailAvailability(user.email);
        if (isEmailAvailable) {
            user.id = uuidv4();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            const newUser = await add(user);
            res.status(200).send(newUser)
        } else {
            res.status(409).send({ message: 'User already exists' })
        }
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
}

async function handleGetUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function handleUpdateUser(req, res) {
    try {
        const userId = req.params.id;
        const userUpdates = req.body;
        const updatedUser = await update(userId, userUpdates);
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

module.exports = { handleAddUser, handleUpdateUser, handleGetUserById }