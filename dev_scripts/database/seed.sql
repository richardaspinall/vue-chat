INSERT INTO user
(user_name, first_name, last_name, password)
VALUES 
('raspinall', 'richard', 'aspinall', 'test'),
('james', 'james', 'smith', 'test'),
('fred', 'fred', 'flintstone', 'test');

INSERT INTO room
(room_name)
VALUES
('random'),
('general');

INSERT INTO message
(room_id, user_id, message, time_stamp)
VALUES
(1,1,"Hey James!", 1624669801.101),
(1,2,"Hey Richard!", 1624669801.102);

INSERT INTO room_users
(room_id, user_id)
VALUES
(1, 1),
(1, 2),
(2, 2);