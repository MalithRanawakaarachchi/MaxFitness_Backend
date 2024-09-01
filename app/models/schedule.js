const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "schedules";

async function addSchedule(data) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO ${TABLE} (id, user_id, exercise, target, equipment, sets, reps, rest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        id,
        data.user_id,
        data.exercise,
        data.target,
        data.equipment,
        data.sets,
        data.reps,
        data.rest,
      ];
      await pool.query(query, values);
      return { id, ...data };
    } catch (error) {
      throw error;
    }
}

async function getSchedulesByUserId(user_id) {
    try {
      const query = `SELECT * FROM ${TABLE} WHERE user_id = ?`;
      const values = [user_id];
      const [rows] = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
}

async function getAllSchedules() {
    try {
      const query = `SELECT * FROM ${TABLE}`;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  

module.exports = {
    addSchedule,
    getSchedulesByUserId,
    getAllSchedules,
  };
  