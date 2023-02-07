const errorMessages = {
  invalidEmail: 'Некорректная почта.',
  invalidUrl: 'Некорректный Url.',
  invalidLanguage: 'Некорректный язык ввода.',
  userIdError: 'Невозможно найти пользователя, не существует в базе.',
  userExistsError:
    'Невозможно зарегистрировать пользователя: email уже использовался для регистрации.',
  authError: 'Необходима авторизация.',
  routeError: 'Ошибка маршрутизации.',
  tokenError: 'Ошибка с токеном авторизации.',
  forbiddenError: 'Недостаточно прав для совершения действия.',
  wrongEmailPassword: 'Невозможно войти: введены неверные почта и пароль.',
};

module.exports = errorMessages;
