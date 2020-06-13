const { MissingParamError } = require('../../utils/erros')
class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth UseCase', () => {
  const makeSut = () => {
    return new AuthUseCase()
  }
  test('should throw if no e-mail is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('should throw if no password is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth('email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
