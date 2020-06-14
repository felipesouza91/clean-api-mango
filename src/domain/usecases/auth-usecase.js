const { MissingParamError } = require('../../utils/erros')
module.exports = class AuthUseCase {
  constructor (loadUserByEmailRespository, encrypeter, tokenGenerater) {
    this.loadUserByEmailRespository = loadUserByEmailRespository
    this.encrypeter = encrypeter
    this.tokenGenerater = tokenGenerater
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
      const accessToke = await this.tokenGenerater.generate(user.id)
      return accessToke
    }
    return null
  }
}
