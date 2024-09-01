const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addSchedule, getSchedulesByUserId, getAllSchedules } = require('../models/schedule');

async function handleAddSchedule(req, res) {
    try {
      const scheduleData = req.body.schedule;
  
      const newSchedule = await addSchedule(scheduleData);
      res.status(200).send(newSchedule);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
}

async function handleGetSchedulesByUserId(req, res) {
    const { user_id } = req.params;

    try {
        const schedules = await getSchedulesByUserId(user_id);
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function handleGetAllSchedules(req, res) {
    try {
      const allSchedules = await getAllSchedules();
      res.status(200).json(allSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }  

module.exports = { handleAddSchedule, handleGetSchedulesByUserId, handleGetAllSchedules }