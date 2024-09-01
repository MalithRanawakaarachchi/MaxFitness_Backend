const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addTrainer, updateTrainer, getAllTrainers, getTrainerById, deleteTrainer } = require('../models/trainer');
const { add, checkEmailAvailability, updateUserForTrainee, deleteUser } = require("../models/users");


async function handleAddTrainer(req, res) {
    try {
        const trainer = req.body.trainer;
        const user = req.body.user;
        const isEmailAvailable = await checkEmailAvailability(user.email);
        if (isEmailAvailable) {
            user.id = uuidv4();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await add(user);
            trainer.user_id = user.id;
            const newTrainer = await addTrainer(trainer);
            res.status(200).send(newTrainer)
        } else {
            res.status(409).send({ message: 'Email already exists' })
        }
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

async function handleUpdateTrainer(req, res) {
    try {
        const trainerId = req.query.trainer_id;
        const userId = req.query.user_id;
        if (!trainerId) res.status(400).send({ message: 'Trainer ID is required' })
        if (!userId) res.status(400).send({ message: 'User ID is required' })
        const data = req.body;
        if (data.trainer) {
            const trainerUpdates = data.trainer;
            await updateTrainer(trainerId, trainerUpdates);
        }
        if (data.user) {
            const userUpdates = data.user;
            await updateUserForTrainee(userId, userUpdates);
        }
        res.status(200).send({ message: 'Trainer updated successfully' });
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

async function handleGetAllTrainers(req, res) {
    try {
      const allTrainers = await getAllTrainers();
      res.status(200).send(allTrainers);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
  }

async function handleDeleteTrainer(req, res) {
    try {
        const trainerId = req.query.trainer_id;
        if (!trainerId) res.status(400).send({ message: 'Trainer ID is required' });

        // First, delete the user associated with the trainer
        const trainer = await getTrainerById(trainerId);
        await deleteUser(trainer.user_id);

        // Next, delete the trainer
        await deleteTrainer(trainerId);

        res.status(200).send({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

module.exports = { handleAddTrainer, handleUpdateTrainer, handleGetAllTrainers, handleDeleteTrainer }