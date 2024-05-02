const express = require('express');
const {
    check, 
    CreateEmployee, 
    employeeEntry, 
    employeeExit, 
    filterEmployeesInfo, 
    getEmployeesEntry,
    handleLogin,
    verifyToken
} = require('../controllers/user')
const router = express.Router()

router.post('/', check)
router.post('/addEmployee', CreateEmployee)
router.post('/punchIn', employeeEntry)
router.post('/punchout', employeeExit)
router.post('/filter', filterEmployeesInfo)
router.post('/getEmployeeEntry', getEmployeesEntry)
router.post('/login', handleLogin)
router.post('/verifyToken',verifyToken)

module.exports = router;