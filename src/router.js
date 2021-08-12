const express = require('express');
const User = require('./controllers/User');
const Room = require('./controllers/Room');
const validation = require('./middeware/validation');

const router = express.Router();

/// User routes ///

// Get a user
router.get('/user/:user_id', User.info);

// Get all users in a room
router.get('/users', User.list);

// Create a user
router.post('/user', validation.createUser, User.create);

/// Room routes ///

// Get a room
router.get('/room/:room_id', Room.info);

// Get all rooms
router.get('/rooms', Room.list);

// Create a room
router.post('/room', validation.createRoom, Room.create);

/// Message routes ///

// Get all messages in a room
router.get('/messages', (req, res) => {
  res.send(`All messages in room ${req.query.room_id}`);
});

// Create a message
router.post('/message', (req, res) => {
  res.send(req.body);
});

/// Authentication routes ///

// Login
router.post('/login', (req, res) => {
  res.send(req.body);
});

// Logout
router.post('/logout', (req, res) => {
  res.send(req.body);
});

// 404 route
router.use('/', (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
