const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "payments";

async function addPayments(data) {
  try {
      const id = uuidv4();
      const currentDate = new Date(); // Use the current date and time
      const formattedDate = currentDate.toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format

      const query = `
          INSERT INTO ${TABLE} (
              id,
              user_id,
              amount,
              method,
              type,
              added_time,
              added_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
          id,
          data.user_id,
          data.amount,
          data.method,
          data.type,
          data.added_time,
          formattedDate, // Use the formatted date
      ];

      await pool.query(query, values);
      return { id, ...data, added_date: formattedDate };
  } catch (error) {
      throw error;
  }
}


async function getAllPayments() {
    try {
      const query = `
        SELECT p.*, u.first_name, u.last_name, u.email
        FROM payments p
        INNER JOIN user u ON p.user_id = u.id
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getAllPaymentsByID(userId) {
    try {
      const query = `
        SELECT p.*, u.first_name, u.last_name, u.email, u.added_date as user_added_date
        FROM payments p
        INNER JOIN user u ON p.user_id = u.id
        WHERE p.user_id = ?
      `;
      const [rows] = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  

module.exports = {
    addPayments,
    getAllPayments,
    getAllPaymentsByID,
  };

