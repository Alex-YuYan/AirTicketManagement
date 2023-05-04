-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 04, 2023 at 02:30 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flightmgr`
--

-- --------------------------------------------------------

--
-- Table structure for table `Airline`
--

CREATE TABLE `Airline` (
  `airline_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Airline`
--

INSERT INTO `Airline` (`airline_name`) VALUES
('Delta');

-- --------------------------------------------------------

--
-- Table structure for table `Airplane`
--

CREATE TABLE `Airplane` (
  `airplane_id` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `num_seat` decimal(3,0) NOT NULL,
  `manufacturer` varchar(60) NOT NULL,
  `manufacture_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Airplane`
--

INSERT INTO `Airplane` (`airplane_id`, `airline_name`, `num_seat`, `manufacturer`, `manufacture_date`) VALUES
('1', 'Delta', '4', 'Boeing', '2013-05-02'),
('2', 'Delta', '4', 'Airbus', '2011-05-02'),
('3', 'Delta', '50', 'Boeing', '2015-05-02'),
('5', 'Delta', '4', 'Boeing', '2018-10-10');

-- --------------------------------------------------------

--
-- Stand-in structure for view `airplane_with_age`
-- (See below for the actual view)
--
CREATE TABLE `airplane_with_age` (
`airplane_id` varchar(60)
,`airline_name` varchar(60)
,`num_seat` decimal(3,0)
,`manufacturer` varchar(60)
,`manufacture_date` date
,`age` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `Airport`
--

CREATE TABLE `Airport` (
  `code` varchar(60) NOT NULL,
  `name` varchar(60) NOT NULL,
  `city` varchar(60) NOT NULL,
  `country` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Airport`
--

INSERT INTO `Airport` (`code`, `name`, `city`, `country`) VALUES
('BEI', 'BEI', 'Beijing', 'China'),
('BOS', 'BOS', 'Boston', 'USA'),
('HKA', 'HKA', 'Hong Kong', 'China'),
('JFK', 'JFK', 'NYC', 'USA'),
('LAX', 'LAX', 'Los Angeles', 'USA'),
('ORD', 'ORD', 'Orlando', 'USA'),
('PVG', 'PVG', 'Shanghai', 'China'),
('SFO', 'SFO', 'San Francisco', 'USA'),
('SHEN', 'SHEN', 'Shenzhen', 'China');

-- --------------------------------------------------------

--
-- Table structure for table `Airport_Type`
--

CREATE TABLE `Airport_Type` (
  `code` varchar(60) NOT NULL,
  `type` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Airport_Type`
--

INSERT INTO `Airport_Type` (`code`, `type`) VALUES
('BEI', 'domestic'),
('BEI', 'international'),
('BOS', 'domestic'),
('BOS', 'international'),
('HKA', 'domestic'),
('HKA', 'international'),
('JFK', 'domestic'),
('JFK', 'international'),
('LAX', 'domestic'),
('LAX', 'international'),
('ORD', 'domestic'),
('PVG', 'domestic'),
('PVG', 'international'),
('SFO', 'domestic'),
('SFO', 'international'),
('SHEN', 'domestic'),
('SHEN', 'international');

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE `Customer` (
  `email` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `building` varchar(60) NOT NULL,
  `street_name` varchar(60) NOT NULL,
  `apt_number` varchar(60) NOT NULL,
  `city` varchar(60) NOT NULL,
  `state` varchar(60) NOT NULL,
  `zipcode` decimal(5,0) NOT NULL,
  `passport_number` varchar(60) NOT NULL,
  `passport_expiration` datetime NOT NULL,
  `passport_country` varchar(60) NOT NULL,
  `date_of_birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`email`, `first_name`, `last_name`, `password`, `building`, `street_name`, `apt_number`, `city`, `state`, `zipcode`, `passport_number`, `passport_expiration`, `passport_country`, `date_of_birth`) VALUES
('studentcustomer@nyu.edu', 'test', 'user', 'e19d5cd5af0378da05f63f891c7467af', '01', 'Jay', '01', 'New York', 'New York', '11201', '00000', '2023-05-19 00:00:00', 'USA', '2023-05-01'),
('testcustomer@nyu.edu', 'Jon', 'Snow', '81dc9bdb52d04dc20036dbd8313ed055', '1555', 'Jay St', '', 'Brooklyn', 'New York', '11201', '54321', '2025-12-24 00:00:00', 'USA', '1999-12-19'),
('user1@nyu.edu', 'Alice', 'Bob', '81dc9bdb52d04dc20036dbd8313ed055', '5405', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54322', '2025-12-25 00:00:00', 'USA', '1999-11-19'),
('user2@nyu.edu', 'Cathy', 'Wood', '81dc9bdb52d04dc20036dbd8313ed055', '1702', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54323', '2025-10-24 00:00:00', 'USA', '1999-10-19'),
('user3@nyu.edu', 'Trudy', 'Jones', '81dc9bdb52d04dc20036dbd8313ed055', '1890', 'Jay Street', '', 'Brooklyn', 'New York', '11201', '54324', '2025-09-24 00:00:00', 'USA', '1999-09-19');

-- --------------------------------------------------------

--
-- Table structure for table `Customer_Phone`
--

CREATE TABLE `Customer_Phone` (
  `email` varchar(60) NOT NULL,
  `phone_number` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customer_Phone`
--

INSERT INTO `Customer_Phone` (`email`, `phone_number`) VALUES
('studentcustomer@nyu.edu', '3470000000'),
('testcustomer@nyu.edu', '123-4321-4321'),
('user1@nyu.edu', '123-4322-4322'),
('user2@nyu.edu', '123-4323-4323'),
('user3@nyu.edu', '123-4324-4324');

-- --------------------------------------------------------

--
-- Table structure for table `Flight`
--

CREATE TABLE `Flight` (
  `flight_number` varchar(60) NOT NULL,
  `dept_date_time` datetime NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `airplane_id` varchar(60) NOT NULL,
  `arrival_date_time` datetime NOT NULL,
  `base_price` decimal(6,2) NOT NULL,
  `status` varchar(60) NOT NULL,
  `dept_airport` varchar(60) NOT NULL,
  `arrival_airport` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Flight`
--

INSERT INTO `Flight` (`flight_number`, `dept_date_time`, `airline_name`, `airplane_id`, `arrival_date_time`, `base_price`, `status`, `dept_airport`, `arrival_airport`) VALUES
('102', '2023-02-09 13:25:25', 'Delta', '3', '2023-02-09 16:50:25', '300.00', 'on-time', 'SFO', 'LAX'),
('104', '2023-03-04 13:25:25', 'Delta', '3', '2023-03-04 16:50:25', '300.00', 'on-time', 'PVG', 'BEI'),
('106', '2023-01-04 13:25:25', 'Delta', '3', '2023-01-04 16:50:25', '350.00', 'delayed', 'SFO', 'LAX'),
('134', '2022-12-11 13:25:25', 'Delta', '3', '2022-12-11 16:50:25', '300.00', 'delayed', 'JFK', 'BOS'),
('206', '2023-07-04 13:25:25', 'Delta', '2', '2023-07-04 16:50:25', '400.00', 'on-time', 'SFO', 'LAX'),
('207', '2023-08-05 13:25:25', 'Delta', '2', '2023-08-05 16:50:25', '300.00', 'on-time', 'LAX', 'SFO'),
('296', '2023-05-30 13:25:25', 'Delta', '1', '2023-05-30 16:50:25', '3000.00', 'delayed', 'PVG', 'SFO'),
('631', '2023-05-20 10:00:00', 'Delta', '5', '2023-05-20 13:00:00', '500.00', 'on-time', 'SFO', 'ORD'),
('715', '2023-02-28 10:25:25', 'Delta', '1', '2023-02-28 13:50:25', '500.00', 'delayed', 'PVG', 'BEI'),
('839', '2022-06-26 13:25:25', 'Delta', '3', '2022-06-26 16:50:25', '300.00', 'on-time', 'SHEN', 'BEI');

-- --------------------------------------------------------

--
-- Table structure for table `Rate`
--

CREATE TABLE `Rate` (
  `flight_number` varchar(60) NOT NULL,
  `dept_date_time` datetime NOT NULL,
  `email` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `rating` decimal(1,0) NOT NULL,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Rate`
--

INSERT INTO `Rate` (`flight_number`, `dept_date_time`, `email`, `airline_name`, `rating`, `comment`) VALUES
('102', '2023-02-09 13:25:25', 'testcustomer@nyu.edu', 'Delta', '4', 'Very Comfortable'),
('102', '2023-02-09 13:25:25', 'user1@nyu.edu', 'Delta', '5', 'Relaxing, check-in and onboarding very professional'),
('102', '2023-02-09 13:25:25', 'user2@nyu.edu', 'Delta', '3', 'Satisfied and will use the same flight again'),
('104', '2023-03-04 13:25:25', 'testcustomer@nyu.edu', 'Delta', '1', 'Customer Care services are not good'),
('104', '2023-03-04 13:25:25', 'user1@nyu.edu', 'Delta', '5', 'Comfortable journey and Professional'),
('715', '2023-02-28 10:25:25', 'testcustomer@nyu.edu', 'Delta', '5', 'Very good service');

-- --------------------------------------------------------

--
-- Table structure for table `Staff`
--

CREATE TABLE `Staff` (
  `username` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `date_of_birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Staff`
--

INSERT INTO `Staff` (`username`, `airline_name`, `password`, `first_name`, `last_name`, `date_of_birth`) VALUES
('admin', 'Delta', 'e2fc714c4727ee9395f324cd2e7f331f', 'Roe', 'Jones', '1978-05-25'),
('student', 'Delta', 'e19d5cd5af0378da05f63f891c7467af', 'admin', 'admin', '2023-05-02');

-- --------------------------------------------------------

--
-- Table structure for table `Staff_Email`
--

CREATE TABLE `Staff_Email` (
  `username` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Staff_Email`
--

INSERT INTO `Staff_Email` (`username`, `email`) VALUES
('admin', 'staff@nyu.edu'),
('student', '1@nyu.edu');

-- --------------------------------------------------------

--
-- Table structure for table `Staff_Phone`
--

CREATE TABLE `Staff_Phone` (
  `username` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Staff_Phone`
--

INSERT INTO `Staff_Phone` (`username`, `phone`) VALUES
('admin', '111-2222-3333'),
('admin', '444-5555-6666'),
('student', '1000000000');

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `flight_number` varchar(60) NOT NULL,
  `dept_date_time` datetime NOT NULL,
  `card_type` varchar(60) NOT NULL,
  `card_number` varchar(60) NOT NULL,
  `name_card` varchar(60) NOT NULL,
  `card_expiration` date NOT NULL,
  `purchase_date_time` datetime NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `date_of_birth` datetime NOT NULL,
  `passport_number` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Ticket`
--

INSERT INTO `Ticket` (`id`, `email`, `airline_name`, `flight_number`, `dept_date_time`, `card_type`, `card_number`, `name_card`, `card_expiration`, `purchase_date_time`, `price`, `first_name`, `last_name`, `date_of_birth`, `passport_number`) VALUES
(1, 'testcustomer@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-01-04 11:55:55', '300.00', 'Jon', 'Snow', '1999-12-19 00:00:00', '54321'),
(2, 'user1@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2027-03-01', '2023-01-03 11:55:55', '300.00', 'Alice', 'Bob', '1999-11-19 00:00:00', '54322'),
(3, 'user2@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 2', '2027-03-01', '2023-02-04 11:55:55', '300.00', 'Cathy', 'Wood', '1999-10-19 00:00:00', '54323'),
(4, 'user1@nyu.edu', 'Delta', '104', '2023-03-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-01-21 11:55:55', '300.00', 'Alice', 'Bob', '1999-11-19 00:00:00', '54322'),
(5, 'testcustomer@nyu.edu', 'Delta', '104', '2023-03-04 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-02-28 11:55:55', '300.00', 'Jon', 'Snow', '1999-12-19 00:00:00', '54321'),
(6, 'testcustomer@nyu.edu', 'Delta', '106', '2023-01-04 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2027-03-01', '2023-01-02 11:55:55', '350.00', 'Jon', 'Snow', '1999-12-19 00:00:00', '54321'),
(7, 'user3@nyu.edu', 'Delta', '106', '2023-01-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2027-03-01', '2022-12-03 11:55:55', '350.00', 'Trudy', 'Jones', '1999-09-19 00:00:00', '54324'),
(8, 'user3@nyu.edu', 'Delta', '839', '2022-06-26 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2022-06-03 11:55:55', '300.00', 'Trudy', 'Jones', '1999-09-19 00:00:00', '54324'),
(9, 'user3@nyu.edu', 'Delta', '102', '2023-02-09 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2022-12-04 11:55:55', '300.00', 'Trudy', 'Jones', '1999-09-19 00:00:00', '54324'),
(11, 'user3@nyu.edu', 'Delta', '134', '2022-12-11 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2027-03-01', '2022-10-23 11:55:55', '300.00', 'Trudy', 'Jones', '1999-09-19 00:00:00', '54324'),
(12, 'testcustomer@nyu.edu', 'Delta', '715', '2023-02-28 10:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2022-10-02 11:55:55', '500.00', 'Jon', 'Snow', '1999-12-19 00:00:00', '54321'),
(14, 'user3@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 3', '2023-03-01', '2023-04-20 11:55:55', '400.00', 'Trudy', 'Jones', '1999-09-19 00:00:00', '54324'),
(15, 'user1@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-04-21 11:55:55', '400.00', 'Alice', 'Bob', '1999-11-19 00:00:00', '54322'),
(16, 'user2@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '1111-2222-3333-5555', 'User 2', '2023-03-01', '2023-02-19 11:55:55', '400.00', 'Cathy', 'Wood', '1999-10-19 00:00:00', '54323'),
(17, 'user1@nyu.edu', 'Delta', '207', '2023-08-05 13:25:25', 'credit', '1111-2222-3333-5555', 'User 1', '2023-03-01', '2023-01-11 11:55:55', '300.00', 'Alice', 'Bob', '1999-11-19 00:00:00', '54322'),
(19, 'user1@nyu.edu', 'Delta', '296', '2023-05-30 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2023-04-22 11:55:55', '3000.00', 'Alice', 'Bob', '1999-11-19 00:00:00', '54322'),
(20, 'testcustomer@nyu.edu', 'Delta', '296', '2023-05-30 13:25:25', 'credit', '1111-2222-3333-4444', 'Test Customer 1', '2023-03-01', '2022-12-12 11:55:55', '3000.00', 'Jon', 'Snow', '1999-12-19 00:00:00', '54321'),
(21, 'testcustomer@nyu.edu', 'Delta', '206', '2023-07-04 13:25:25', 'credit', '0000000000000000', 'Jon', '2023-05-25', '2023-05-03 21:07:11', '500.00', 'Jone', 'Snow', '1999-12-19 00:00:00', '54321');

-- --------------------------------------------------------

--
-- Structure for view `airplane_with_age`
--
DROP TABLE IF EXISTS `airplane_with_age`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `airplane_with_age`  AS SELECT `airplane`.`airplane_id` AS `airplane_id`, `airplane`.`airline_name` AS `airline_name`, `airplane`.`num_seat` AS `num_seat`, `airplane`.`manufacturer` AS `manufacturer`, `airplane`.`manufacture_date` AS `manufacture_date`, timestampdiff(YEAR,`airplane`.`manufacture_date`,curdate()) AS `age` FROM `airplane``airplane`  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Airline`
--
ALTER TABLE `Airline`
  ADD PRIMARY KEY (`airline_name`);

--
-- Indexes for table `Airplane`
--
ALTER TABLE `Airplane`
  ADD PRIMARY KEY (`airplane_id`),
  ADD KEY `airline_name` (`airline_name`);

--
-- Indexes for table `Airport`
--
ALTER TABLE `Airport`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `Airport_Type`
--
ALTER TABLE `Airport_Type`
  ADD PRIMARY KEY (`code`,`type`);

--
-- Indexes for table `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `Customer_Phone`
--
ALTER TABLE `Customer_Phone`
  ADD PRIMARY KEY (`email`,`phone_number`);

--
-- Indexes for table `Flight`
--
ALTER TABLE `Flight`
  ADD PRIMARY KEY (`flight_number`,`dept_date_time`,`airline_name`),
  ADD KEY `dept_airport` (`dept_airport`),
  ADD KEY `arrival_airport` (`arrival_airport`),
  ADD KEY `airline_name` (`airline_name`),
  ADD KEY `airplane_id` (`airplane_id`);

--
-- Indexes for table `Rate`
--
ALTER TABLE `Rate`
  ADD PRIMARY KEY (`flight_number`,`dept_date_time`,`airline_name`,`email`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `Staff`
--
ALTER TABLE `Staff`
  ADD PRIMARY KEY (`username`),
  ADD KEY `airline_name` (`airline_name`);

--
-- Indexes for table `Staff_Email`
--
ALTER TABLE `Staff_Email`
  ADD PRIMARY KEY (`username`,`email`);

--
-- Indexes for table `Staff_Phone`
--
ALTER TABLE `Staff_Phone`
  ADD PRIMARY KEY (`username`,`phone`);

--
-- Indexes for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Ticket_UN` (`email`,`airline_name`,`flight_number`,`first_name`,`last_name`,`date_of_birth`),
  ADD KEY `flight_number` (`flight_number`,`dept_date_time`,`airline_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Ticket`
--
ALTER TABLE `Ticket`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Airplane`
--
ALTER TABLE `Airplane`
  ADD CONSTRAINT `airplane_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`);

--
-- Constraints for table `Airport_Type`
--
ALTER TABLE `Airport_Type`
  ADD CONSTRAINT `airport_type_ibfk_1` FOREIGN KEY (`code`) REFERENCES `Airport` (`code`);

--
-- Constraints for table `Customer_Phone`
--
ALTER TABLE `Customer_Phone`
  ADD CONSTRAINT `customer_phone_ibfk_1` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`);

--
-- Constraints for table `Flight`
--
ALTER TABLE `Flight`
  ADD CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`dept_airport`) REFERENCES `Airport` (`code`),
  ADD CONSTRAINT `flight_ibfk_2` FOREIGN KEY (`arrival_airport`) REFERENCES `Airport` (`code`),
  ADD CONSTRAINT `flight_ibfk_3` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`),
  ADD CONSTRAINT `flight_ibfk_4` FOREIGN KEY (`airplane_id`) REFERENCES `Airplane` (`airplane_id`);

--
-- Constraints for table `Rate`
--
ALTER TABLE `Rate`
  ADD CONSTRAINT `rate_ibfk_1` FOREIGN KEY (`flight_number`,`dept_date_time`,`airline_name`) REFERENCES `Flight` (`flight_number`, `dept_date_time`, `airline_name`),
  ADD CONSTRAINT `rate_ibfk_2` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`);

--
-- Constraints for table `Staff`
--
ALTER TABLE `Staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`);

--
-- Constraints for table `Staff_Email`
--
ALTER TABLE `Staff_Email`
  ADD CONSTRAINT `staff_email_ibfk_1` FOREIGN KEY (`username`) REFERENCES `Staff` (`username`);

--
-- Constraints for table `Staff_Phone`
--
ALTER TABLE `Staff_Phone`
  ADD CONSTRAINT `staff_phone_ibfk_1` FOREIGN KEY (`username`) REFERENCES `Staff` (`username`);

--
-- Constraints for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`flight_number`,`dept_date_time`,`airline_name`) REFERENCES `Flight` (`flight_number`, `dept_date_time`, `airline_name`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
