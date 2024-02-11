// Import required
const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let departmentList = [];
let roleList = [];
let managerList = [];
let employeeList = [];

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

let addRoleQuestion = [{
    type: 'input',
    name: 'newRole',
    message: 'What role would you like to add?',
}, {
    type: 'input',
    name: 'newSalary',
    message: 'What is the salary for this new role?',
}, {
    type: 'list',
    name: 'newLinkedDepartment',
    message: 'What department is this role in?',
    choices: departmentList,
}
];

let addEmployeeQuestion = [{
    type: 'input',
    name: 'newFName',
    message: 'What is the employee\'s first name?',
}, {
    type: 'input',
    name: 'newLName',
    message: 'What is the employee\'s last name?',
}, {
    type: 'confirm',
    name: 'isManager',
    message: 'Is this employee a manager?',
}, {
    type: 'list',
    name: 'newRole',
    message: 'What role is the employee assigned to?',
    choices: roleList,
}, {
    type: 'list',
    name: 'newManager',
    message: 'What manager is the employee assigned to?',
    choices: managerList
}
];

let updateEmployeeQuestion = [{
    //There is a bug in node when a list is the first type in a prompt. It won't display the list choices.
    //Let's subliminally influence that employees are awesome.
    type: 'confirm',
    name: 'tempFix',
    message: 'Employees are the heart of our business.',
}, {
    type: 'list',
    name: 'empToUpdate',
    message: 'Which employee would you like to update?',
    choices: employeeList,
},    
{
    type: 'list',
    name: 'newRole',
    message: 'What role should the employee be assigned to?',
    choices: roleList,
}
];

function init() {
    try {
        let sqlQuery = '';
        let inputValue = '';
        
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

                            queryData(sqlQuery, '', 'view', '');

                            // User is routed back to the initial question to determine the next operation.
                            init();
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
                        
                        queryData(sqlQuery, '', 'view', '');

                        // User is routed back to the initial question to determine the next operation.
                        init();
                        break;
                    case 'Add Department':
                        inquirer.prompt(addDepartmentQuestion).then((answers) => {
                            inputValue = [answers.newDepartment];
                            sqlQuery = 'INSERT INTO DEPARTMENT (NAME) VALUES (?)';
                            queryData(sqlQuery, [inputValue], '', '');
                            console.log(`\nDepartment ${answers.newDepartment} added.\n`);

                            // User is routed back to the initial question to determine the next operation.
                            init();                            
                        });
                        break;
                    case 'Add Role':
                        sqlQuery = `SELECT ID, NAME FROM DEPARTMENT ORDER BY NAME`;
                        queryData(sqlQuery, [ ], 'list', 'Department');

                        inquirer.prompt(addRoleQuestion).then((answers) => {
                            sqlQuery = 'INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) VALUES (?, ?, ?)';
                            queryData(sqlQuery, [answers.newRole, answers.newSalary, answers.newLinkedDepartment], 'insert', 'Role');
                            console.log(`\n\nRole ${answers.newRole} added.\n\n`);

                            // User is routed back to the initial question to determine the next operation.
                            init();
                        });
                        break;
                    case 'Add Employee':
                        break;
                    case 'Update Employee Role':
                        break;
                    case 'Exit':
                        console.log("\n\nThank you for using the Drowsier Emu Employee Tracker. Goodbye.")
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
                case 'list':
                    switch (category)
                    {
                        case 'Department':
                            for (i = 0; i < res.length; i++) {
                                departmentList.push({'name' : res[i].NAME, 'value': res[i].ID});
                            };
                            break;
                        case 'Employee':
                            for (i = 0; i < res.length; i++) {
                                employeeList.push({'name' : res[i].NAME, 'value': res[i].ID});
                            };
                        break;
                        case 'Manager':
                            for (i = 0; i < res.length; i++) {
                                managerList.push({'name' : res[i].NAME, 'value': res[i].ID});
                            };
                            break;
                        case 'Role':
                            for (i = 0; i < res.length; i++) {
                                roleList.push({'name' : res[i].NAME, 'value': res[i].ID});
                            };
                            break;
                    }
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