const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "trainer";

async function addTrainer(data) {
    try {
        const id = uuidv4();
        const date = Date.now();
        const query = `INSERT INTO ${TABLE} (id, user_id, address, nic, dob, contact_number, added_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            id,
            data.user_id,
            data.address,
            data.nic,
            data.dob,
            data.contact_number,
            date,
            date,
        ];
        await pool.query(query, values);
        return { id, ...data, added_date: date, modified_date: date };
    } catch (error) {
        throw error;
    }
}

async function updateTrainer(id, data) {
    try {
        const date = Date.now();
        const query = `UPDATE ${TABLE} SET  address = ?, nic = ?, dob = ?, contact_number = ?, modified_date = ? WHERE id = ?`;
        const values = [
            data.address,
            data.nic,
            data.dob,
            data.contact_number,
            date,
            id,
        ];
        await pool.query(query, values);
        return { id, ...data, modified_date: date };
    } catch (error) {
        throw error;
    }
}

async function getTrainerById(id) {
    try {
        const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
        const values = [id];
        const [rows] = await pool.query(query, values);
        if (rows.length === 0) {
            throw new Error(`Trainer with ID ${id} not found`);
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function getAllTrainers() {
    try {
      const query = `
        SELECT t.*, u.first_name, u.last_name, u.email, u.password, u.added_date as user_added_date, u.modified_date as user_modified_date, u.user_level
        FROM ${TABLE} t
        INNER JOIN user u ON t.user_id = u.id
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

async function deleteTrainer(id) {
    try {
        const query = `DELETE FROM ${TABLE} WHERE id = ?`;
        const values = [id];
        await pool.query(query, values);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addTrainer,
    updateTrainer,
    getTrainerById,
    getAllTrainers,
    deleteTrainer,
};
