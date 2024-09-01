const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "traineemetrics";

async function addMetrics(data) {
    try {
      const id = uuidv4();
      const query = `
        INSERT INTO ${TABLE} (
          id,
          user_id,
          weight,
          height,
          bmi,
          whr,
          blood_group,
          bfp,
          lbm,
          fat_mass,
          ideal_body_weight,
          waist_circumference,
          special_notes,
          level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        id,
        data.user_id,
        data.weight,
        data.height,
        data.bmi,
        data.whr,
        data.blood_group,
        data.bfp,
        data.lbm,
        data.fat_mass,
        data.ideal_body_weight,
        data.waist_circumference,
        data.special_notes,
        data.level,
      ];
      await pool.query(query, values);
      return { id, ...data };
    } catch (error) {
      throw error;
    }
  }

  async function getMetricsByUserId(user_id) {
    try {
      const query = `SELECT * FROM ${TABLE} WHERE user_id = ?`;
      const values = [user_id];
      const [rows] = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {
    addMetrics,
    getMetricsByUserId
  };
  