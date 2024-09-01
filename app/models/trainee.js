const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "trainee";

async function addTrainee(data) {
  try {
    const id = uuidv4();
    const addedDate = Date.now(); 
    const modifiedDate = Date.now();
    const query = `INSERT INTO ${TABLE} (id, user_id, address, nic, dob, contact_number, gender, added_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      id,
      data.user_id,
      data.address,
      data.nic,
      data.dob,
      data.contact_number,
      data.gender,
      addedDate,
      modifiedDate,
    ];
    await pool.query(query, values);
    return { id, ...data, added_date: addedDate, modified_date: modifiedDate };
  } catch (error) {
    throw error;
  }
}

async function updateTrainee(id, data) {
  try {
    const modifiedDate = Date.now(); 
    const query = `UPDATE ${TABLE} SET  address = ?, nic = ?, dob = ?, contact_number = ?, gender= ?, modified_date = ? WHERE id = ?`;
    const values = [
      data.address,
      data.nic,
      data.dob,
      data.contact_number,
      data.gender,
      modifiedDate,
      id,
    ];
    await pool.query(query, values);
    return { id, ...data, modified_date: modifiedDate };
  } catch (error) {
    throw error;
  }
}

async function getTraineeById(id) {
  try {
    const query = `SELECT *, UNIX_TIMESTAMP(added_date) AS added_date, UNIX_TIMESTAMP(modified_date) AS modified_date FROM ${TABLE} WHERE id = ?`;
    const values = [id];
    const [rows] = await pool.query(query, values);
    if (rows.length === 0) {
      throw new Error(`Trainee with ID ${id} not found`);
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllTrainees() {
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

async function deleteTrainee(id) {
  try {
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    const values = [id];
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
}


module.exports = {
  addTrainee,
  updateTrainee,
  getTraineeById,
  getAllTrainees,
  deleteTrainee,
};
