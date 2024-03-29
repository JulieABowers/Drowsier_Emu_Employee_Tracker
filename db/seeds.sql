USE employees_db;

DELETE FROM EMPLOYEE;
DELETE FROM ROLE;
DELETE FROM DEPARTMENT;

INSERT INTO DEPARTMENT (NAME) 
VALUES 
    ('Human Resources'),
    ('IT'),
    ('Development');

INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) SELECT 'Owner', 500000, ID FROM DEPARTMENT WHERE NAME = 'DEVELOPMENT';
INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) SELECT 'Manager', 120000, ID FROM DEPARTMENT WHERE NAME = 'IT';
INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) SELECT 'Underling', 75000, ID FROM DEPARTMENT WHERE NAME = 'IT';
INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) SELECT 'Supervisor', 80000, ID FROM DEPARTMENT WHERE NAME = 'Human Resources';
INSERT INTO ROLE (TITLE, SALARY, DEPARTMENT_ID) SELECT 'Coffee Gofer', 45000, ID FROM DEPARTMENT WHERE NAME = 'Human Resources';

INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID) SELECT 'Dmitri', 'Bowers', TRUE, ID FROM ROLE WHERE TITLE = 'Owner';

INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID, MANAGER_ID) SELECT 'Bronson', 'Bowers', FALSE, R.ID, E.ID FROM ROLE R, EMPLOYEE E WHERE TITLE = 'Manager' AND E.FIRST_NAME = 'Dmitri' AND E.LAST_NAME = 'Bowers';
INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID, MANAGER_ID) SELECT 'Yuri', 'Bowers', FALSE, R.ID, E.ID FROM ROLE R, EMPLOYEE E WHERE TITLE = 'Supervisor' AND E.FIRST_NAME = 'Dmitri' AND E.LAST_NAME = 'Bowers';
INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, IS_MANAGER, ROLE_ID, MANAGER_ID) SELECT 'Charles', 'Bowers', FALSE, R.ID, E.ID FROM ROLE R, EMPLOYEE E WHERE TITLE = 'Coffee Gofer' AND E.FIRST_NAME = 'Dmitri' AND E.LAST_NAME = 'Bowers';