const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

describe('Auth UseCase', () => {
  const makeSut = () => {
    class LoadUserByEmailRespositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRespositorySpy = new LoadUserByEmailRespositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRespositorySpy)
    return {
      sut, loadUserByEmailRespositorySpy
    }
  }
  test('should throw if no e-mail is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('email@email.com')
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRespository with correct email', async () => {
    const { sut, loadUserByEmailRespositorySpy } = makeSut()
    await sut.auth('email@email.com', 'password')
    expect(loadUserByEmailRespositorySpy.email).toBe('email@email.com')
  })

  test('should throw if no loadUserByEmailRespository is provider', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('email@email.com', 'password')
    await expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRespository'))
  })

  test('should throw if loadUserByEmailRespository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('email@email.com', 'password')
    await expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRespository'))
  })
  test('should return null if loadUserByEmailRespository returns null', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth('invalid_email@email.com', 'password')
    expect(acessToken).toBe(null)
  })
})
