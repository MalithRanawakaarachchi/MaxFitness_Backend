const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addMetrics, getMetricsByUserId } = require('../models/metrics');

async function handleAddMetrics(req, res) {
    try {
      const metricsData = req.body.metrics;
  
      const newMetrics = await addMetrics(metricsData);
      res.status(200).send(newMetrics);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
}

async function handleGetMetricsByUserId(req, res) {
    const { user_id } = req.params;

    try {
        const metrics = await getMetricsByUserId(user_id);
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  
  module.exports = { handleAddMetrics, handleGetMetricsByUserId }