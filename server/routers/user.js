const express = require('express');
const {
    check, 
    CreateEmployee, 
    employeeEntry, 
    employeeExit, 
    filterEmployeesInfo, 
    getEmployeesEntry,
    handleLogin,
    verifyToken,
    addProducts,
    getProducts,
} = require('../controllers/user')
const router = express.Router()

router.get('/', check);
router.post('/addEmployee', CreateEmployee);
router.post('/punchIn', employeeEntry);
router.post('/punchout', employeeExit);
router.post('/filter', filterEmployeesInfo);
router.post('/getEmployeeEntry', getEmployeesEntry);
router.get('/login/:email/:password', handleLogin);
router.get('/verifyToken',verifyToken);
router.post('/addProduct', addProducts);
router.get('/fetchProducts', getProducts);

module.exports = router;