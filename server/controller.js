require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize (CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

let nextEmp = 5

module.exports = { 
    getAllClients: (req,res) =>{
    sequelize.query (`SELECT * from cc_users u 
    JOIN cc_clients c  ON c.user_id = u.user_id;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    getPendingAppointments:(req,res) =>{
        sequelize.query(`SELECT * FROM cc_appointments
        WHERE approved = false
        ORDER BY date DESC;`)
            .then(dbResponse => res.status(200).send(dbResponse[0]))
            .catch(err => console.log(err))
    },   

    getUpcomingAppointments: (req, res) => {
        sequelize.query(`SELECT a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        FROM cc_appointments a
        JOIN cc_emp_appts ea ON a.appt_id = ea.appt_id
        JOIN cc_employees e ON e.emp_id = ea.emp_id
        JOIN cc_users u ON e.user_id = u.user_id
        WHERE a.approved = true and a.completed = false
        ORDER BY a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    getPastAppointments:(req,res) =>{
        sequelize.query(`SELECT  *  FROM cc_appointments  a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name 
        JOIN cc_emp_appts ea ON a.appt_id = ea.appt_id
        JOIN cc_employees e ON e.emp_id = ea.emp_id
        JOIN cc_users u ON e.user_id = u.user_id
        WHERE a.approved = true and a.completed = true
        ORDER BY a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))

    },
    approveAppointments: (req, res) => {
        let {apptId} = req.body
    
        sequelize.query(`UPDATE cc_appointements 
        SET approved = true
        WHERE appt_id = ${apptId};

        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

completeAppointment: (req,res) =>{
    sequelize.query (`SELECT * FROM cc_appointements
    SET completed = true
    WHERE appt_id = ${apptId}`)
        .then(dbResponse =>res.status(200).send(dbResponse[0]))
        .catch(err => console.log(err))
},

}
