USE employees_db;

DELETE FROM DEPARTMENT;
DELETE FROM ROLE;
DELETE FROM EMPLOYEE;

INSERT INTO DEPARTMENT (NAME) 
VALUES 
    ('Human Resources'),
    ('IT'),
    ('Development');

INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID)
VALUES
    ('Owner', 500000, 3),
    ('Manager', 120000, 2),
    ('Underling', 75000, 2),
    ('Supervisor', 80000, 1),
    ('Coffee Gofer', 45000, 3);

INSERT INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID)
VALUES
    (1, 'Dmitri', 'Bowers', TRUE, 1);

INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID, MANAGER_ID)
VALUES
    ('Bronson', 'Bowers', FALSE, 3, 1),
    ('Yuri', 'Bowers', FALSE, 5, 1),
    ('Charles','Bowers', FALSE, 2, 1);