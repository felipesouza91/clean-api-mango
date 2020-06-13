const { MissingParamError, InvalidParamError } = require('../../utils/erros')
module.exports = class AuthUseCase {
  constructor (loadUserByEmailRespository) {
    this.loadUserByEmailRespository = loadUserByEmailRespository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRespository) {
      throw new MissingParamError('loadUserByEmailRespository')
    }
    if (!this.loadUserByEmailRespository.load) {
      throw new InvalidParamError('loadUserByEmailRespository')
    }
    const user = await this.loadUserByEmailRespository.load(email)
    if (!user) {
      return null
    }
  }
}
