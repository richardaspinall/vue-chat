USE vuechat_dev;

CREATE TABLE user
(
  user_id INT unsigned NOT NULL AUTO_INCREMENT,     
  user_name VARCHAR(20) NOT NULL UNIQUE,             
  first_name VARCHAR(50),                  
  last_name VARCHAR(50),                   
  password CHAR(60) NOT NULL,                       
  PRIMARY KEY (user_id)                             
);

CREATE TABLE room
(
  room_id INT unsigned NOT NULL AUTO_INCREMENT,    
  room_name VARCHAR(20) NOT NULL UNIQUE,                                                        
  PRIMARY KEY (room_id) 
);

CREATE TABLE message
(
  message_id INT unsigned NOT NULL AUTO_INCREMENT,
  room_id INT unsigned NOT NULL, 
  user_id INT unsigned NOT NULL,                                       
  time_stamp DECIMAL(13, 3) NOT NULL,                          
  message TEXT NOT NULL,         
  FOREIGN KEY (room_id) REFERENCES room(room_id),                            
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  PRIMARY KEY (message_id)                                 
);

CREATE TABLE room_users
(
  room_id INT unsigned NOT NULL,
  user_id INT unsigned NOT NULL,                                      
  FOREIGN KEY (room_id) REFERENCES room(room_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id),      
  PRIMARY KEY (room_id, user_id)                                    
);