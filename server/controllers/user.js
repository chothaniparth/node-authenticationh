const sql = require('mssql/msnodesqlv8');
const hwt = require('jsonwebtoken')
const { DB_connection } = require('../DB_connect');
const { response } = require('express');
DB_connection()

const request = new sql.Request();

function check (req, res){
    console.log('server workking');
    res.json({success : true})
}

async function CreateEmployee(req, res) {
    try {
        const { firstName, lastName, email, gender } = req.body;
        if (!firstName || !lastName || !email || !gender) {
            return res.json({ success: false, msg: "Missing required fields" });
        }
        if (gender !== 'male' && gender !== 'female' && gender !== 'other') {
            return res.json({ success: false, msg: "Invalid gender" });
        }
        const emailExistsQuery = `SELECT COUNT(*) AS count FROM employeesInfo WHERE email = '${email}'`;
        const emailExistsResult = await request.query(emailExistsQuery);
        if (emailExistsResult.recordset[0].count > 0) {
            console.log(emailExistsResult);
            return res.json({ success: false, msg: "Email already exists" });
        }
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '');
        const insertQuery = `INSERT INTO employeesInfo (firstName, lastName, email, gender, createTime) VALUES ('${firstName}', '${lastName}', '${email}', '${gender}','${formattedDate}')`;
        const insertResult = await request.query(insertQuery);
        console.log(insertResult);
        return res.json({ success: true });
    } catch (error) {
        console.log("Create employee error:", error);
        return res.json({ success: false, msg: "Internal server error" });
    }
}

async function employeeEntry(req, res){
    try {
        const {id} = req.body;
        if (!id) {
            return res.json({success: false, msg: 'Employee ID is required'});
        }
        // check Id exists or not
        const checkIdQuary = `select * from employeesInfo where id = ${id}`
        const checkIdResponse = await request.query(checkIdQuary);
        console.log(checkIdResponse);   
        if(checkIdResponse.recordset.length == 0){
            console.log("invelid ID :", checkIdQuary.recordset);
            return res.json({success : false, msg : "invelid ID, please enter velid ID"})
        }
        const findIdDataQuary = `SELECT * FROM employees_Entry_exit WHERE employeeID = ${id}`;
        const findIdData = await request.query(findIdDataQuary);
        if(findIdData.recordset.length !== 0 && findIdData.recordset[findIdData.recordset.length - 1].employeeExit == null){
            console.log(findIdData.recordset[findIdData.recordset.length - 1]);
            return res.json({success : false, msg : 'you cannot do entry without exit.'})
        }
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '');
        const query = `INSERT INTO employees_Entry_exit (employeeID, employeeEntry) VALUES (${id}, '${formattedDate}')`;
        const response = await request.query(query);
        // console.log(response);
        res.json({success: true});
    } catch (error) {
        console.error('Error in employeeEntry API:', error);
        res.status(500).json({success: false, msg: 'Something went wrong on the server'});
    }
}

async function employeeExit(req, res) {
    try {
        const { id } = req.body;
        const findIdDataQuary = `SELECT * FROM employees_Entry_exit WHERE employeeID = ${id}`;
        const findIdData = await request.query(findIdDataQuary);
        
        if (findIdData.recordset.length === 0) {
            return res.json({ success: false, message: 'Employee record not found' });
        }
        console.log(findIdData.recordset);
        if(findIdData.recordset[findIdData.recordset.length - 1].employeeExit != null){
            return res.json({success : false, message : 'make new entry you can not do exit.'});
        }
        
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '');
        const lastIEntry = findIdData.recordset[findIdData.recordset.length - 1].srID;

        const updateQuary = `UPDATE employees_Entry_exit SET employeeExit = '${formattedDate}' WHERE srID = ${lastIEntry}`;
        const exitResponse = await request.query(updateQuary);

        console.log('Employee exit record updated successfully :', exitResponse);
        res.json({ success: true });
    } catch (error) {
        console.log('Error in employee exit API:', error);
        res.json({ success: false, message: 'Something went wrong' });
    }
}

async function filterEmployeesInfo(req, res){
    try{
        const {year, month, day} = req.body;
        const setDate = year + '-' + month + '-' +  day
        const quary = `SELECT * FROM employees_Entry_exit WHERE CAST(employeeEntry AS DATE) = '${setDate}'`
        const data = await request.query(quary)
        const responseData = data.recordset
        res.json({success : true, data : responseData})
    } catch (error){
        console.log('filter error :', error);
        return res.json({success : false})
    }
}

module.exports = {
    check,
    CreateEmployee,
    employeeEntry,
    employeeExit,
    filterEmployeesInfo
}