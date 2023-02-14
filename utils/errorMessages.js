const errorMessages = {
  invalidEmail: 'Некорректная почта.',
  invalidUrl: 'Некорректный Url.',
  userIdError: 'Невозможно найти пользователя, не существует в базе.',
  movieIdError: 'Невозможно найти фильм, не существует в базе.',
  userExistsError:
    'Невозможно зарегистрировать пользователя: email уже использовался для регистрации.',
  authError: 'Необходима авторизация.',
  routeError: 'Ошибка маршрутизации.',
  tokenError: 'Ошибка с токеном авторизации.',
  forbiddenError: 'Недостаточно прав для совершения действия.',
  wrongEmailPassword: 'Невозможно войти: введены неверные почта и пароль.',
  removingMovieError: 'Невозможно удалить фильм: на найден в базе.',
  changeEmailError: 'Невозможно изменить почту. Данная почта занята другим пользователем.',
};

module.exports = errorMessages;
