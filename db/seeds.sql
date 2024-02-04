USE employees_db;

DELETE FROM DEPARTMENT;
DELETE FROM ROLE;
DELETE FROM EMPLOYEE;

INSERT INTO DEPARTMENT (NAME) 
VALUES 
    ('Human Resources'),
    ('IT'),
    ('Executive');

INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID)
VALUES
    ('Do Not Delete', 0, 1),
    ('Owner', 500000, 3),
    ('Manager', 120000, 2),
    ('Underling', 75000, 2),
    ('Supervisor', 80000, 1);

INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID)
VALUES
    ('Dmitri', 'Bowers', TRUE, 2);