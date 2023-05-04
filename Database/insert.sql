-- insert airline
INSERT INTO 
    Airline
VALUES 
    ('Delta');

-- insert staff & staff_phone & staff_email
INSERT INTO 
    Staff
VALUES
    ('admin', 'Delta', 'e2fc714c4727ee9395f324cd2e7f331f', 'Roe', 'Jones', '1978-05-25');

INSERT INTO 
    Staff_Phone
VALUES
    ('admin', '111-2222-3333'),
    ('admin', '444-5555-6666');

INSERT INTO
    Staff_Email
VALUES
    ('admin', 'staff@nyu.edu');

-- insert Airplane
INSERT INTO 
    Airplane
VALUES 
    ('1', 'Delta', 4, 'Boeing', '2013-05-02'),
    ('2', 'Delta', 4, 'Airbus', '2011-05-02'),
    ('3', 'Delta', 50, 'Boeing', '2015-05-02');

-- insert Airport & Airport_Type
INSERT INTO 
    Airport
VALUES 
    ('JFK', 'JFK', 'NYC', 'USA'),
    ('BOS', 'BOS', 'Boston', 'USA'),
    ('PVG', 'PVG', 'Shanghai', 'China'),
    ('BEI', 'BEI', 'Beijing', 'China'),
    ('SFO', 'SFO', 'San Francisco', 'USA'),
    ('LAX', 'LAX', 'Los Angeles', 'USA'),
    ('HKA', 'HKA', 'Hong Kong', 'China'),
    ('SHEN', 'SHEN', 'Shenzhen', 'China');

INSERT INTO 
    Airport_Type
VALUES 
    ('JFK', 'domestic'),
    ('BOS', 'domestic'),
    ('PVG', 'domestic'),
    ('BEI', 'domestic'),
    ('SFO', 'domestic'),
    ('LAX', 'domestic'),
    ('HKA', 'domestic'),
    ('SHEN', 'domestic'),
    ('JFK', 'international'),
    ('BOS', 'international'),
    ('PVG', 'international'),
    ('BEI', 'international'),
    ('SFO', 'international'),
    ('LAX', 'international'),
    ('HKA', 'international'),
    ('SHEN', 'international');

-- insert Customer & Customer_Phone
INSERT INTO
    Customer
VALUES 
    ('testcustomer@nyu.edu', 'Jon', 'Snow', '81dc9bdb52d04dc20036dbd8313ed055', '1555', 'Jay St', '', 'Brooklyn', 'New York', '11201', '54321', '2025-12-24', 'USA', '1999-12-19'),
    ('user1@nyu.edu', 'Alice', 'Bob', '81dc9bdb52d04dc20036dbd8313ed055', '5405', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54322', '2025-12-25', 'USA', '1999-11-19'),
    ('user2@nyu.edu', 'Cathy', 'Wood', '81dc9bdb52d04dc20036dbd8313ed055', '1702', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54323', '2025-10-24', 'USA', '1999-10-19'),
    ('user3@nyu.edu', 'Trudy', 'Jones', '81dc9bdb52d04dc20036dbd8313ed055', '1890', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54324', '2025-09-24', 'USA', '1999-09-19');

INSERT INTO
    Customer_Phone
VALUES
    ('testcustomer@nyu.edu', '123-4321-4321'),
    ('user1@nyu.edu', '123-4322-4322'),
    ('user2@nyu.edu', '123-4323-4323'),
    ('user3@nyu.edu', '123-4324-4324');

-- insert Flight
INSERT INTO
    Flight
VALUES
    ('102', '2023-02-09 13:25:25', 'Delta', '3', '2023-02-09 16:50:25', 300, 'on-time', 'SFO', 'LAX'),
    ('104', '2023-03-04 13:25:25', 'Delta', '3', '2023-03-04 16:50:25', 300, 'on-time', 'PVG', 'BEI'),
    ('106', '2023-01-04 13:25:25', 'Delta', '3', '2023-01-04 16:50:25', 350, 'delayed', 'SFO', 'LAX'),
    ('206', '2023-07-04 13:25:25', 'Delta', '2', '2023-07-04 16:50:25', 400, 'on-time', 'SFO', 'LAX'),
    ('207', '2023-08-05 13:25:25', 'Delta', '2', '2023-08-05 16:50:25', 300, 'on-time', 'LAX', 'SFO'),
    ('134', '2022-12-11 13:25:25', 'Delta', '3', '2022-12-11 16:50:25', 300, 'delayed', 'JFK', 'BOS'),
    ('296', '2023-05-30 13:25:25', 'Delta', '1', '2023-05-30 16:50:25', 3000, 'on-time', 'PVG', 'SFO'),
    ('715', '2023-02-28 10:25:25', 'Delta', '1', '2023-02-28 13:50:25', 500, 'delayed', 'PVG', 'BEI'),
    ('839', '2022-06-26 13:25:25', 'Delta', '3', '2022-06-26 16:50:25', 300, 'on-time', 'SHEN', 'BEI');


-- insert Ticket
INSERT INTO
    Ticket
VALUES
    (1, 'testcustomer@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-01-04 11:55:55', 300.00, 'Jon', 'Snow', '1999-12-19', '54321'),
    (2, 'user1@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2027-03-01', '2023-01-03 11:55:55', 300.00, 'Alice', 'Bob', '1999-11-19', '54322'),
    (3, 'user2@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 2', '2027-03-01', '2023-02-04 11:55:55', 300.00, 'Cathy', 'Wood', '1999-10-19', '54323'),
    (4, 'user1@nyu.edu', 'Delta', '104', '2023-03-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-01-21 11:55:55', 300.00, 'Alice', 'Bob', '1999-11-19', '54322'),
    (5, 'testcustomer@nyu.edu', 'Delta', '104', '2023-03-04 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-02-28 11:55:55', 300.00, 'Jon', 'Snow', '1999-12-19', '54321'),
    (6, 'testcustomer@nyu.edu', 'Delta', '106', '2023-01-04 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-01-02 11:55:55', 350.00, 'Jon', 'Snow', '1999-12-19', '54321'),
    (7, 'user3@nyu.edu', 'Delta', '106', '2023-01-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2027-03-01', '2022-12-03 11:55:55', 350.00, 'Trudy', 'Jones', '1999-09-19', '54324'),
    (8, 'user3@nyu.edu', 'Delta', '839', '2022-06-26 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2022-06-03 11:55:55', 300, 'Trudy', 'Jones', '1999-09-19', '54324'),
    (9, 'user3@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2022-12-04 11:55:55', 300, 'Trudy', 'Jones', '1999-09-19', '54324'),
    (11, 'user3@nyu.edu', 'Delta', '134', '2022-12-11 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2027-03-01', '2022-10-23 11:55:55', 300, 'Trudy', 'Jones', '1999-09-19', '54324'),
    (12, 'testcustomer@nyu.edu', 'Delta', '715', '2023-02-28 10:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2022-10-02 11:55:55', 500, 'Jon', 'Snow', '1999-12-19', '54321'),
    (14, 'user3@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2023-04-20 11:55:55', 400, 'Trudy', 'Jones', '1999-09-19', '54324'),
    (15, 'user1@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-04-21 11:55:55', 400, 'Alice', 'Bob', '1999-11-19', '54322'),
    (16, 'user2@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 2', '2023-03-01', '2023-02-19 11:55:55', 400, 'Cathy', 'Wood', '1999-10-19', '54323'),
    (17, 'user1@nyu.edu', 'Delta', '207', '2023-08-05 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-01-11 11:55:55', 300, 'Alice', 'Bob', '1999-11-19', '54322'),
    (18, 'testcustomer@nyu.edu', 'Delta', '207', '2023-08-05 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2023-02-25 11:55:55', 300, 'Jon', 'Snow', '1999-12-19', '54321'),
    (19, 'user1@nyu.edu', 'Delta', '296', '2023-05-30 13:25:25', 'credit', '1111-2222-3333-4444', ' Test Customer 1', '2023-03-01', '2023-04-22 11:55:55', 3000, 'Alice', 'Bob', '1999-11-19', '54322'),
    (20, 'testcustomer@nyu.edu', 'Delta', '296', '2023-05-30 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2022-12-22 11:55:55', 3000, 'Jon', 'Snow', '1999-12-19', '54321');


-- insert Rate
INSERT INTO
    Rate
VALUES
    ('102', '2023-02-09 13:25:25', 'testcustomer@nyu.edu', 'Delta', 4, 'Very Comfortable'),
    ('102', '2023-02-09 13:25:25', 'user1@nyu.edu', 'Delta', 5, 'Relaxing, check-in and onboarding very professional'),
    ('102', '2023-02-09 13:25:25', 'user2@nyu.edu', 'Delta', 3, 'Satisfied and will use the same flight again'),
    ('104', '2023-03-04 13:25:25', 'testcustomer@nyu.edu', 'Delta', 1, 'Customer Care services are not good'),
    ('104', '2023-03-04 13:25:25', 'user1@nyu.edu', 'Delta', 5, 'Comfortable journey and Professional');
