-- DROP TABLE IF EXISTS Customers;
-- CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
-- INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES 
-- (1, 'Alfreds Futterkiste', 'Maria Anders'), 
-- (4, 'Around the Horn', 'Thomas Hardy'), 
-- (11, 'Bs Beverages', 'Victoria Ashworth'), 
-- (13, 'Bs Beverages', 'Random Name');


DROP table if exists t_entity_fly_point;
CREATE TABLE IF NOT EXISTS t_entity_fly_point (
	`id` INTEGER PRIMARY KEY autoincrement,
	`create_time` TEXT default current_timestamp,
	`update_time` TEXT default current_timestamp,
	`create_user_id` INTEGER,
  `last_modify_user_id` INTEGER,
	`status` INTEGER,
	`type` TEXT,
	`point` TEXT,
	`source` TEXT
);
insert into t_entity_fly_point (`Type`, Status) values ("h44jjj", 1);
insert into t_entity_fly_point (`Type`, Status) values ("wewweewew", 0);