const { MissingParamError } = require('../../utils/erros')
module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRespository, encrypeter, tokenGenerator, updateAccessTokenRepository } = { }) {
    this.loadUserByEmailRespository = loadUserByEmailRespository
    this.encrypeter = encrypeter
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRespository.load(email)
    const isValid = user && await this.encrypeter.compare(password, user.password)
    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)
      await this.updateAccessTokenRepository.update(user.id, accessToken)
      return accessToken
    }
    return null
  }
}
