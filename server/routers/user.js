const express = require('express');
const {check, CreateEmployee, employeeEntry, employeeExit, filterEmployeesInfo, getEmployeesEntry} = require('../controllers/user')
const router = express.Router()

router.post('/', check)
router.post('/addEmployee', CreateEmployee)
router.post('/punchIn', employeeEntry)
router.post('/punchout', employeeExit)
router.post('/filter', filterEmployeesInfo)
router.post('/getEmployeeEntry', getEmployeesEntry)

module.exports = router;