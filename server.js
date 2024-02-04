// Import required
const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employees_db'
    }
);

const question = {
    type: 'list',
    name: 'WhatToDo',
    message: 'What would you like to do?',
    choices: [  'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
    ]
};

function init() {
    try {
        inquirer.prompt(question).then((answers) => {
            const { WhatToDo } = answers;
                switch (WhatToDo)
                {
                    case 'View All Departments':
                        viewAllDepartments();
                        break;
                    case 'View All Roles':
                        break;
                    case 'View All Employees':
                        viewAllEmployees();
                        break;
                    case 'Add Department':
                        break;
                    case 'Add Role':
                        break;
                    case 'Add Employee':
                        break;
                    case 'Update Employee Role':
                        break;
                    case 'Exit':
                        console.log("Thank you for using the Drowsier Emu Employee Tracker. Goodbye.")
                        db.end();
                        break;
                    default:
                        break;
                }
        });
    } catch (err) {
        console.error(err);
    }
}

function viewAllDepartments() {
    try {
        /*  When "View All Departments" is chosen, all departments in the DEPARTMENT table and their ID will be displayed.

            For the department data, the following columns will be pulled from the DEPARTMENT table.

            Column Display Name     Column Name
            ----------------------  --------------------------
            Department ID           ID
            Department              NAME
        */
        let sqlQuery = 'SELECT ID AS "Department ID", NAME AS "Department Name" FROM DEPARTMENT ORDER BY NAME;';
        db.query(sqlQuery, (err, res) => {
            if (err) throw err;
            // The requested data is presented
            console.table(res);
            
            // User is routed back to the initial question to determine the next operation.
            init();
        })
    } catch (err) {
        console.error(err);
    }    
}

function viewAllEmployees() {
    try {
        /*  When "View All Employees" is chosen, all employee plus role and department information is returned.

            For the employees' data, the following columns will be pulled from the EMPLOYEE table.
            
            Column Display Name     Column Name
            ----------------------  --------------------------
            Employee ID             ID
            First Name              FIRST_NAME
            Last Name               LAST_NAME

            For the employees' role data, the following columns will be pulled from the ROLE table.
            The ROLE table will be linked to the EMPLOYEE table via EMPLOYEE.ROLE_ID = ROLE.ID. From the 
            ROLE table the follow columns will be pulled:

            Column Display Name     Column Name
            ----------------------  --------------------------
            Title                   TITLE
            Salary                  SALARY

            For the employees' department data, the following columns will be pulled from the DEPARTMENT table.
            The DEPARTMENT table will be linked to the ROLE table via ROLE.DEPARTMENT_ID = DEPARTMENT.ID. From the 
            DEPARTMENT table the follow columns will be pulled:

            Column Display Name     Column Name
            ----------------------  --------------------------
            Department              NAME

            For the employees' manager data, the following columns will be pulled from the EMPLOYEE table.
            The EMPLOYEE table will be linked to the EMPLOYEE table via EMPLOYEE.MANAGER_ID = EMPLOYEE.ID. From the 
            EMPLOYEE table the follow columns will be pulled:

            Column Display Name     Column Name
            ----------------------  --------------------------
            Manager Name            Concatenation of FIRST_NAME and LAST_NAME
        */
        let sqlQuery = 'SELECT E.ID AS "Employee ID", ';
        sqlQuery += 'E.FIRST_NAME AS "First Name", E.LAST_NAME AS "Last Name", ';
        sqlQuery += 'D.NAME AS Department, R.TITLE AS Title, CONCAT(\'$ \', FORMAT(R.SALARY, 2)) AS Salary, ';
        sqlQuery += 'CONCAT(E1.FIRST_NAME, " ", E1.LAST_NAME) AS "Manager Name" ';
        sqlQuery += 'FROM EMPLOYEE E JOIN ROLE R ON E.ROLE_ID = R.ID ';
        sqlQuery += 'JOIN EMPLOYEE E1 ON E.MANAGER_ID = E1.ID ';
        sqlQuery += 'JOIN DEPARTMENT D ON R.DEPARTMENT_ID = D.ID ';
        sqlQuery += 'ORDER BY E.FIRST_NAME, E.LAST_NAME;';
        db.query(sqlQuery, (err, res) => {
            if (err) throw err;
            // The requested data is presented
            console.table(res);
            
            // User is routed back to the initial question to determine the next operation.
            init();
        })
    } catch (err) {
        console.error(err);
    }
}

init();