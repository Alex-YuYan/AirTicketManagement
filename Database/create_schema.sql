-- flightmgr.Airline definition

CREATE TABLE `Airline` (
  `airline_name` varchar(60) NOT NULL,
  PRIMARY KEY (`airline_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Airport definition

CREATE TABLE `Airport` (
  `code` varchar(60) NOT NULL,
  `name` varchar(60) NOT NULL,
  `city` varchar(60) NOT NULL,
  `country` varchar(60) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Customer definition

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
  `date_of_birth` date NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Airplane definition

CREATE TABLE `Airplane` (
  `airplane_id` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `num_seat` decimal(3,0) NOT NULL,
  `manufacturer` varchar(60) NOT NULL,
  `manufacture_date` date NOT NULL,
  PRIMARY KEY (`airplane_id`),
  KEY `airline_name` (`airline_name`),
  CONSTRAINT `airplane_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW Airplane_with_age AS
SELECT
    *,
    TIMESTAMPDIFF(YEAR, manufacture_date, CURDATE()) AS age
FROM
    Airplane;

-- flightmgr.Airport_Type definition

CREATE TABLE `Airport_Type` (
  `code` varchar(60) NOT NULL,
  `type` varchar(60) NOT NULL,
  PRIMARY KEY (`code`,`type`),
  CONSTRAINT `airport_type_ibfk_1` FOREIGN KEY (`code`) REFERENCES `Airport` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Customer_Phone definition

CREATE TABLE `Customer_Phone` (
  `email` varchar(60) NOT NULL,
  `phone_number` varchar(60) NOT NULL,
  PRIMARY KEY (`email`,`phone_number`),
  CONSTRAINT `customer_phone_ibfk_1` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Flight definition

CREATE TABLE `Flight` (
  `flight_number` varchar(60) NOT NULL,
  `dept_date_time` datetime NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `airplane_id` varchar(60) NOT NULL,
  `arrival_date_time` datetime NOT NULL,
  `base_price` decimal(6,2) NOT NULL,
  `status` varchar(60) NOT NULL,
  `dept_airport` varchar(60) NOT NULL,
  `arrival_airport` varchar(60) NOT NULL,
  PRIMARY KEY (`flight_number`,`dept_date_time`,`airline_name`),
  KEY `dept_airport` (`dept_airport`),
  KEY `arrival_airport` (`arrival_airport`),
  KEY `airline_name` (`airline_name`),
  KEY `airplane_id` (`airplane_id`),
  CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`dept_airport`) REFERENCES `Airport` (`code`),
  CONSTRAINT `flight_ibfk_2` FOREIGN KEY (`arrival_airport`) REFERENCES `Airport` (`code`),
  CONSTRAINT `flight_ibfk_3` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`),
  CONSTRAINT `flight_ibfk_4` FOREIGN KEY (`airplane_id`) REFERENCES `Airplane` (`airplane_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Rate definition

CREATE TABLE `Rate` (
  `flight_number` varchar(60) NOT NULL,
  `dept_date_time` datetime NOT NULL,
  `email` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `rating` decimal(1,0) NOT NULL,
  `comment` text,
  PRIMARY KEY (`flight_number`,`dept_date_time`,`airline_name`,`email`),
  KEY `email` (`email`),
  CONSTRAINT `rate_ibfk_1` FOREIGN KEY (`flight_number`, `dept_date_time`, `airline_name`) REFERENCES `Flight` (`flight_number`, `dept_date_time`, `airline_name`),
  CONSTRAINT `rate_ibfk_2` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Staff definition

CREATE TABLE `Staff` (
  `username` varchar(60) NOT NULL,
  `airline_name` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `date_of_birth` date NOT NULL,
  PRIMARY KEY (`username`),
  KEY `airline_name` (`airline_name`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `Airline` (`airline_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Staff_Email definition

CREATE TABLE `Staff_Email` (
  `username` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  PRIMARY KEY (`username`,`email`),
  CONSTRAINT `staff_email_ibfk_1` FOREIGN KEY (`username`) REFERENCES `Staff` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Staff_Phone definition

CREATE TABLE `Staff_Phone` (
  `username` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  PRIMARY KEY (`username`,`phone`),
  CONSTRAINT `staff_phone_ibfk_1` FOREIGN KEY (`username`) REFERENCES `Staff` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- flightmgr.Ticket definition

CREATE TABLE `Ticket` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
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
  `passport_number` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Ticket_UN` (`email`,`airline_name`,`flight_number`,`first_name`,`last_name`,`date_of_birth`),
  KEY `flight_number` (`flight_number`,`dept_date_time`,`airline_name`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`flight_number`, `dept_date_time`, `airline_name`) REFERENCES `Flight` (`flight_number`, `dept_date_time`, `airline_name`),
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`email`) REFERENCES `Customer` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;