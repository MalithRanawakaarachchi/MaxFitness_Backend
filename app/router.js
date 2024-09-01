const { handleLogin, handleAdminLogin } = require('./controllers/auth')
const { Authenticate } = require("./services/auth")

// user
const { handleAddUser, handleUpdateUser, handleGetUserById } = require("./controllers/users")
// trainee
const { handleAddTrainee, handleUpdateTrainee, handleGetAllTrainees, handleGetTraineeById, handleDeleteTrainee } = require("./controllers/trainee")
// trainer
const { handleAddTrainer, handleUpdateTrainer, handleGetAllTrainers, handleDeleteTrainer } = require("./controllers/trainer")
// schedule
const {handleAddSchedule, handleGetSchedulesByUserId, handleGetAllSchedules} = require("./controllers/schedule")
// metrics
const {handleAddMetrics, handleGetMetricsByUserId} = require("./controllers/metrics")
// payments
const {handleAddPayments, handleGetAllPayments, handleGetAllPaymentsByID} = require("./controllers/payments")
// equipment
const {handleAddEquipment} = require("./controllers/equipment")


const express = require('express')
const router = express.Router()

// auth
router.post('/auth/login', handleLogin)

// admin login
router.post('/auth/admin/login', handleAdminLogin)

// user
router.post('/user', handleAddUser)
router.put('/user/:id', handleUpdateUser)
router.get('/user/:id', handleGetUserById)

// trainee
router.post('/trainee', handleAddTrainee)
router.put('/trainee', handleUpdateTrainee)
router.get('/trainee', handleGetAllTrainees)
router.get('/trainee/:id', handleGetTraineeById);
router.delete('/trainee/:id', handleDeleteTrainee)

// trainer
router.post('/trainer', handleAddTrainer)
router.put('/trainer', handleUpdateTrainer)
router.get('/trainer', handleGetAllTrainers);
router.delete('/trainer/:id', handleDeleteTrainer)

// schedule
router.post('/schedule', handleAddSchedule)
router.get('/schedule/:user_id', handleGetSchedulesByUserId);
router.get('/schedule', handleGetAllSchedules);

// metrics
router.post('/metrics', handleAddMetrics)
router.get('/metrics/:user_id', handleGetMetricsByUserId);

// payments
router.post('/payments', handleAddPayments)
router.get('/payments', handleGetAllPayments);
router.get('/payments/:userId', handleGetAllPaymentsByID);

// equipments
router.post('/equipments', handleAddEquipment);

router.get('/me', Authenticate, (req, res) => {
    res.json(req.user);
})

module.exports = router 