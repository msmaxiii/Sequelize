require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {
    getAllClients,
    getPendingAppointments,
    getUpcomingAppointments,
    getPastAppointments, 
    approveAppointments, 
    completeAppointment, 
    deleteAppointment
} = require('./controller.js')

app.use(express.json())
app.use(cors())

// USERS
app.get('/clients', getAllClients)

// APPOINTMENTS
app.get('/pending', getPendingAppointments)
app.get('/upcoming', getUpcomingAppointments)
app.get('/appt', getPastAppointments)
app.put('/approve', approveAppointments)
app.put('/complete', completeAppointment)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))