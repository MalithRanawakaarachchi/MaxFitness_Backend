const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addTrainee, updateTrainee, getAllTrainees, deleteTrainee, getTraineeById } = require('../models/trainee');
const { add, checkEmailAvailability, updateUserForTrainee,deleteUser } = require("../models/users");

async function handleAddTrainee(req, res) {
    try {
        const trainee = req.body.trainee;
        const user = req.body.user;
        const isEmailAvailable = await checkEmailAvailability(user.email);
        if (isEmailAvailable) {
            user.id = uuidv4();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await add(user);
            trainee.user_id = user.id;
            const newTrainee = await addTrainee(trainee);
            res.status(200).send(newTrainee)
        } else {
            res.status(409).send({ message: 'Email already exists' })
        }
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

async function handleUpdateTrainee(req, res) {
    try {
        const traineeId = req.query.trainee_id;
        const userId = req.query.user_id;
        if (!traineeId) res.status(400).send({ message: 'Trainee ID is required' })
        if (!userId) res.status(400).send({ message: 'User ID is required' })
        const data = req.body;
        if (data.trainee) {
            const traineeUpdates = data.trainee;
            await updateTrainee(traineeId, traineeUpdates);
        }
        if (data.user) {
            const userUpdates = data.user;
            await updateUserForTrainee(userId, userUpdates);
        }
        res.status(200).send({ message: 'Trainee updated successfully' });
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

async function handleGetAllTrainees(req, res) {
    try {
      const allTrainees = await getAllTrainees();
      res.status(200).send(allTrainees);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
}

async function handleGetTraineeById(req, res) {
    const { id } = req.params;
  
    try {
      const trainee = await getTraineeById(id);
      res.status(200).json(trainee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async function handleDeleteTrainee(req, res) {
    try {
      const traineeId = req.query.trainee_id;
      if (!traineeId) res.status(400).send({ message: 'Trainee ID is required' });
  
      // First, delete the user associated with the trainee
      const trainee = await getTraineeById(traineeId);
      await deleteUser(trainee.user_id);
  
      // Next, delete the trainee
      await deleteTrainee(traineeId);
  
      res.status(200).send({ message: 'Trainee deleted successfully' });
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
  }

module.exports = { handleAddTrainee, handleUpdateTrainee, handleGetAllTrainees, handleGetTraineeById, handleDeleteTrainee }