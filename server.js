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

//Options presented to the user
const doWhatQuestion = {
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

const addDepartmentQuestion = {
    type: 'input',
    name: 'newDepartment',
    message: 'What department would you like to add?',
};
function init() {
    try {
        let sqlQuery = '';

        inquirer.prompt(doWhatQuestion).then((answers) => {
            const { WhatToDo } = answers;
                switch (WhatToDo)
                {
                    case 'View All Departments':
                        /*  When "View All Departments" is chosen, all departments in the DEPARTMENT table and their ID will be displayed.

                            For the department data, the following columns will be pulled from the DEPARTMENT table.

                            Column Display Name     Column Name
                            ----------------------  --------------------------
                            Department ID           ID
                            Department              NAME
                        */
                        sqlQuery = 'SELECT ID AS "Department ID", NAME AS "Department Name" FROM DEPARTMENT ORDER BY NAME;';

                        queryData(sqlQuery, '', 'view', '');

                        // User is routed back to the initial question to determine the next operation.
                        init();
                        break;
                    case 'View All Roles':
                        /*  When "View All Roles" is chosen, all role and department information is returned.

                            For the roles' data, the following columns will be pulled from the ROLE table.
                            
                            Column Display Name     Column Name
                            ----------------------  --------------------------
                            Title                   TITLE
                            Salary                  SALARY

                            For the roles' department data, the following columns will be pulled from the DEPARTMENT table.
                            The DEPARTMENT table will be linked to the ROLE table via ROLE.DEPARTMENT_ID = DEPARTMENT.ID. From the 
                            DEPARTMENT table the follow columns will be pulled:

                            Column Display Name     Column Name
                            ----------------------  --------------------------
                            Department              NAME
                        */
                            sqlQuery = 'SELECT R.ID AS "Role ID", R.TITLE AS Title, D.NAME AS Department, CONCAT(\'$ \', FORMAT(R.SALARY, 2)) AS Salary ';
                            sqlQuery += 'FROM ROLE R ';
                            sqlQuery += 'JOIN DEPARTMENT D ON R.DEPARTMENT_ID = D.ID ';
                            sqlQuery += 'ORDER BY R.TITLE;';
                        viewData(sqlQuery);
                        break;
                    case 'View All Employees':
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
                        sqlQuery = 'SELECT E.ID AS "Employee ID", E.FIRST_NAME AS "First Name", E.LAST_NAME AS "Last Name", ';
                        sqlQuery += 'D.NAME AS Department, R.TITLE AS Title, CASE WHEN R.SALARY >= 0 THEN CONCAT(\'$ \', FORMAT(R.SALARY, 2)) ';
                        sqlQuery += 'ELSE IFNULL(R.SALARY, "") END AS Salary, IFNULL(CONCAT(E1.FIRST_NAME, " ", E1.LAST_NAME), "") AS "Manager Name" ';
                        sqlQuery += 'FROM EMPLOYEE E JOIN ROLE R ON E.ROLE_ID = R.ID ';
                        sqlQuery += 'LEFT JOIN EMPLOYEE E1 ON E.MANAGER_ID = E1.ID ';
                        sqlQuery += 'JOIN DEPARTMENT D ON R.DEPARTMENT_ID = D.ID ';
                        sqlQuery += 'ORDER BY E.FIRST_NAME, E.LAST_NAME;';
                        console.log(sqlQuery);
                        viewData(sqlQuery);
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

function queryData(sqlQuery, bindVar, action, category) {
    try {
        db.query(sqlQuery, bindVar, (err, res) => {
            // The requested data is presented
            let newList = [];
            
            switch (action)
            {
                case 'view':
                    console.table(res);
                    break;
                default:
                    break;
            }
        })
    } catch (err) {
        console.error(err);
    }    
}

init();