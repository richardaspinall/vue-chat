const DBConnection = require('../database/dbConnection');

const User = {
  info: async (req, res) => {
    try {
      const [result] = await DBConnection.execute({
        sql: 'SELECT user_id, user_name, first_name, last_name FROM user WHERE user_id = ?',
        values: [req.params.user_id],
      });

      if (result) {
        res.send({
          user_id: result.user_id,
          user_name: result.user_name,
          first_name: result.first_name,
          last_name: result.last_name,
        });
      } else {
        res.status(404).send({ error: 'user_not_found' });
      }
    } catch (error) {
      console.log(error);
    }
  },
  list: async (req, res) => {
    try {
      let result;

      if (req.query.room_id) {
        result = await DBConnection.execute({
          sql: 'SELECT user.user_id, user.user_name, user.first_name, user.last_name FROM room_users JOIN user on room_users.user_id = user.user_id WHERE room_id = ?',
          values: [req.query.room_id],
        });
      } else {
        result = await DBConnection.execute({
          sql: 'SELECT user.user_id, user.user_name, user.first_name, user.last_name FROM user',
        });
      }

      if (result[0]) {
        const userList = { users: [] };

        result.forEach((user) => {
          userList.users.push({
            user_id: user.user_id,
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
          });
        });

        res.send(userList);
      } else {
        res.status(404).send({ error: 'users_not_found' });
      }
    } catch (error) {
      console.log(error);
    }
  },
  create: async (req, res) => {
    try {
      await DBConnection.execute({
        sql: 'INSERT INTO user SET ?',
        values: [req.body],
      });

      const [result] = await DBConnection.execute({
        sql: 'SELECT user_id, user_name, first_name, last_name FROM user WHERE user_name = ?',
        values: [req.body.user_name],
      });

      res.send({
        user_id: result.user_id,
        user_name: result.user_name,
        first_name: result.first_name,
        last_name: result.last_name,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).send({
          error: 'user_name_taken',
        });
        return;
      }
      console.log(error);
    }
  },
};

module.exports = User;
