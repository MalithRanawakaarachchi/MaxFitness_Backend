const pool = require("../mysql/mysql");
const { v4: uuidv4 } = require("uuid");

const TABLE = "equipment";

async function addEquipment(data) {
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO ${TABLE} (
        id,
        name,
        description,
        muscles_used,
        gif,
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      id,
      data.name,
      data.description,
      data.muscles_used,
      data.gif
    ];

    await pool.query(query, values);

    return {
      id,
      name: data.name,
      description: data.description,
      muscles_used: data.muscles_used,
      gif: data.gif,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addEquipment,
};
