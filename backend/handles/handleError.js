const http2 = require('http2').constants;
const {
  DocumentNotFoundError, CastError, ValidationError,
} = require('mongoose').Error;
const ForbiddenError = require('./ForbiddenError');
const UnauthorizedError = require('./UnauthorizedError');
const NotFoundError = require('./NotFoundError');

const handleError = ((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    return res.status(http2.HTTP_STATUS_UNAUTHORIZED).send({ message: err.message });
  }
  if (err instanceof ForbiddenError) {
    return res.status(http2.HTTP_STATUS_FORBIDDEN).send({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: err.message });
  }
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map((error) => error.message).join(';');
    return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
      message: `Переданы некорректные данные при создании ${message}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(http2.HTTP_STATUS_NOT_FOUND).send({
      message: 'Объект с указанным _id не найден ',
    });
  }
  if (err instanceof CastError) {
    return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
      message: `Передан несуществующий _id: ${err.value}`,
    });
  }
  if (err.code === 11000) {
    return res.status(http2.HTTP_STATUS_CONFLICT).send({
      message: 'пользователь существует',
    });
  }
  res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    message: `Что-то пошло не так ${err.name}: ${err.message}`,
  });
  return next();
});

module.exports = {
  handleError,
};
