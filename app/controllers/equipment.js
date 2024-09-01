const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addEquipment } = require('../models/equipment');

async function handleAddEquipment(req, res) {
    try {
      const equipmentData = req.body.equipment;
      const imageFile = req.files.image; // Assuming the file input in the form has the name "image"
  
      // Assuming you have some validation checks before adding equipment
      // ...
  
      // Add unique identifier
      equipmentData.id = uuidv4();
  
      // Save the image
      const imageName = `${equipmentData.id}_${imageFile.name}`;
      imageFile.mv(`uploads/${imageName}`, (err) => {
        if (err) {
          return res.status(500).send({ err: 'Error saving image' });
        }
  
        // Add the image name to the equipment data
        equipmentData.image = imageName;
  
        // Add the equipment to the database
        const newEquipment = await addEquipment(equipmentData);
  
        res.status(200).send(newEquipment);
      });
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
  }

module.exports = {
  handleAddEquipment,
};
