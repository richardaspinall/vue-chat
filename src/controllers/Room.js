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
  list: async (req, res) => {
    try {
      const result = await DBConnection.execute({
        sql: 'SELECT room_id, room_name FROM room',
      });

      if (result[0]) {
        const roomList = { rooms: [] };

        result.forEach((room) => {
          roomList.rooms.push({
            room_id: room.room_id,
            room_name: room.room_name,
          });
        });

        res.send(roomList);
      } else {
        res.status(404).send({ error: 'rooms_not_found' });
      }
    } catch (error) {
      console.log(error);
    }
  },
  create: async (req, res) => {
    try {
      await DBConnection.execute({
        sql: 'INSERT INTO room SET ?',
        values: [req.body],
      });

      const [result] = await DBConnection.execute({
        sql: 'SELECT room_id, room_name FROM room WHERE room_name = ?',
        values: [req.body.room_name],
      });

      res.send({
        room_id: result.room_id,
        room_name: result.room_name,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).send({
          error: 'room_name_taken',
        });
        return;
      }
      console.log(error);
    }
  },
};

module.exports = Room;
