const pool = require("../mysql/mysql");

const TABLE = "user";

async function add(data) {
    try {
        const date = Date.now();
        const query = `INSERT INTO ${TABLE} (id, first_name, last_name, email, password, added_date, modified_date, user_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [data.id, data.first_name, data.last_name, data.email, data.password, date, date, data.user_level];
        await pool.query(query, values);
        return data;
    } catch (error) {
        throw error;
    }
}

async function getUserById(id) {
  try {
    const query = `SELECT * FROM ${TABLE} WHERE id = ?`;
    const values = [id];
    const [rows] = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`User with ID ${id} not found`);
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
}


async function update(id, data) {
    try {
        const date = Date.now();
        const query = `UPDATE ${TABLE} SET first_name = ?, last_name = ?, email = ?, modified_date = ? WHERE id = ?`;
        const values = [data.first_name, data.last_name, data.email, date, id];
        await pool.query(query, values);
        return data;
    } catch (error) {
        throw error;
    }
}

async function updateUserForTrainee(id, data) {
    try {
        const date = Date.now();
        const query = `UPDATE ${TABLE} SET first_name = ?, last_name = ?, email = ?, modified_date = ? WHERE id = ?`;
        const values = [data.first_name, data.last_name, data.email, date, id];
        await pool.query(query, values);
        return data;
    } catch (error) {
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
      const query = `
        SELECT u.*, t.address AS trainer_address, t.nic AS trainer_nic, t.dob AS trainer_dob, t.contact_number AS trainer_contact_number
        FROM user u
        LEFT JOIN trainer t ON u.id = t.user_id
        WHERE u.email = ?;
      `;
  
      const values = [email];
      const [rows] = await pool.query(query, values);
  
      if (rows.length === 0) {
        throw new Error(`User with email ${email} not found`);
      }
      const user = rows[0];

      if (user.trainer_address) {
        user.isTrainer = true;
      } else {
        user.isTrainer = false;
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function getTraineeByEmail(email) {
    try {
      const query = `
        SELECT u.*, t.address AS trainee_address, t.nic AS trainee_nic, t.dob AS trainee_dob, t.contact_number AS trainee_contact_number, t.gender AS trainee_gender
        FROM user u
        LEFT JOIN trainee t ON u.id = t.user_id
        WHERE u.email = ?;
      `;
  
      const values = [email];
      const [rows] = await pool.query(query, values);
  
      if (rows.length === 0) {
        throw new Error(`User with email ${email} not found`);
      }
      const user = rows[0];

      if (user.trainee_address) {
        user.isTrainee = true;
      } else {
        user.isTrainee = false;
      }
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  

async function checkEmailAvailability(email) {
    try {
        const user = await getUserByEmail(email);
        return false;
    } catch (error) {
        if (error.message.includes("not found")) {
            return true;
        }
        throw error;
    }
}

async function deleteUser(id) {
    try {
      const query = `DELETE FROM ${TABLE} WHERE id = ?`;
      const values = [id];
      await pool.query(query, values);
    } catch (error) {
      throw error;
    }
  }
  

module.exports = {
    add,
    update,
    getUserByEmail,
    checkEmailAvailability,
    updateUserForTrainee,
    deleteUser,
    getTraineeByEmail,
    getUserById
};
