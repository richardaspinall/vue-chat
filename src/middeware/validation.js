function createUser(req, res, next) {
  const user = req.body;
  let error;

  if (user.user_name === '') {
    error = 'user_name_missing';
  } else if (user.user_name.length > 20) {
    error = 'user_name_maxlength';
  } else if ((user.first_name.length || user.last_name.length) > 20) {
    error = 'name_maxlength';
  } else if (user.password.length < 10) {
    error = 'password_minlength';
  }

  if (error) {
    res.status(422).send({ error });
  } else {
    next();
  }
}

module.exports = {
  createUser,
};
