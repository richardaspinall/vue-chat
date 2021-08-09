USE vuechatapp;

CREATE TABLE user
(
  user_id INT unsigned NOT NULL AUTO_INCREMENT,     -- ID of user
  username VARCHAR(20) NOT NULL UNIQUE,             -- Username of user
  first_name VARCHAR(20) NOT NULL,                  -- First name of user
  last_name VARCHAR(20) NOT NULL,                   -- Username of users
  password CHAR(60) NOT NULL,                       -- Password hashed
  PRIMARY KEY (user_id)                             -- Set user_id as primary key
);