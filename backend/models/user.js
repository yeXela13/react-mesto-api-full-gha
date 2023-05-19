const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../handles/UnauthorizedError');

const { urlRegExp } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле должно содержать более 2 символов'],
    maxlength: [30, 'Поле должно содержать более 2 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Поле должно содержать более 2 символов'],
    maxlength: [30, 'Поле должно содержать более 2 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (avatar) => urlRegExp.test(avatar),
      message: 'Некоректный адрес изображения',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Заполните это поле'],
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некоректный Email',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните это поле'],
    select: false,
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильная почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
