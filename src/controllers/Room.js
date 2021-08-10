const DBConnection = require('../database/dbConnection');

const Room = {
  info: async (req, res) => {
    const [result] = await DBConnection.execute({
      sql: 'SELECT room_id, room_name FROM room WHERE room_id = ?',
      values: [req.params.room_id],
    });

    res.send({
      room_id: result.room_id,
      room_name: result.room_name,
    });
  },
};

module.exports = Room;
