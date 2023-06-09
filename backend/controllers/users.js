const { NODE_ENV, JWT_SECRET } = process.env;
const http2 = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../handles/NotFoundError');
const ConflictError = require('../handles/ConflictError');

const getUsers = (req, res, next) => {
  userSchema.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

const getUserMyInfo = (req, res, next) => {
  const id = req.user._id;
  userSchema.findById(id)
    .orFail(() => {
      throw new NotFoundError('Такого пользователя не существует');
    })
    .then((data) => res.status(http2.HTTP_STATUS_OK).send(data))
    .catch(next);
};

const getUser = (req, res, next) => {
  const id = req.params.userId;
  userSchema.findById(id)
    .orFail(() => {
      throw new NotFoundError('Такого пользователя не существует');
    })
    .then((data) => res.status(http2.HTTP_STATUS_OK).send(data))
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await userSchema.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => {
      res.status(http2.HTTP_STATUS_CREATED).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Указанный email уже зарегистрирован. Пожалуйста используйте другой email'));
      } else {
        next(err);
      }
    });
};

const updateInfo = (req, res, next, updateData) => {
  userSchema.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateInfo(req, res, next, { name, about });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateInfo(req, res, next, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => {
      if (error.message === 'Неправильные почта или пароль') {
        return next(new Error('Неправильные почта или пароль'));
      }
      return next(error);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserMyInfo,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
