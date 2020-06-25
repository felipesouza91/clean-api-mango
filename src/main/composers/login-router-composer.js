const env = require('../config/env')
const LoginRouter = require('../../presentation/routes/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/email-validator')
const LoadUserByEmailRepository = require('../../infra/repository/load-user-by-email-repository')
const Encrypter = require('../../utils/encrypter')
const UpdateAccessTokenRepository = require('../../infra/repository/update-access-token-repository')
const TokenGenerator = require('../../utils/token-generator')

module.exports = class LoginRouterComposer {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encrypeter = new Encrypter()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypeter,
      tokenGenerator
    })
    return new LoginRouter({
      authUseCase,
      emailValidator
    })
  }
}
