const { MissingParamError } = require('../../utils/erros')
class AuthUseCase {
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
    await this.loadUserByEmailRespository.load(email)
  }
}

describe('Auth UseCase', () => {
  const makeSut = () => {
    return new AuthUseCase()
  }
  test('should throw if no e-mail is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth('email@email.com')
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRespository with correct email', async () => {
    class LoadUserByEmailRespositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRespositorySpy = new LoadUserByEmailRespositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRespositorySpy)
    await sut.auth('email@email.com', 'password')
    expect(loadUserByEmailRespositorySpy.email).toBe('email@email.com')
  })
})
