const express = require('express');

const router = express.Router();

/// User routes ///

// Get a user
router.get('/user/:user_id', (req, res) => {
  res.send(`User ${req.params.user_id}`);
});

// Get all users in a room
router.get('/users', (req, res) => {
  res.send(`All users in room ${req.query.room_id}`);
});

// Create a user
router.post('/user', (req, res) => {
  res.send(req.body);
});

/// Room routes ///

// Get a room
router.get('/room/:room_id', (req, res) => {
  res.send(`Room ${req.params.room_id}`);
});

// Get all rooms
router.get('/rooms', (req, res) => {
  res.send('All rooms');
});

// Create a room
router.post('/room', (req, res) => {
  res.send(req.body);
});

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
