const { MissingParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

const makeEncryper = () => {
  class EncrypeterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypeterSpy = new EncrypeterSpy()
  encrypeterSpy.isValid = true
  return encrypeterSpy
}

const makeEncryperWithError = () => {
  class EncrypeterSpy {
    async compare (password, hashedPassword) {
      throw new Error()
    }
  }
  return new EncrypeterSpy()
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRespositorySpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUserByEmailRespositorySpy()
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGenerator = new TokenGeneratorSpy()
  tokenGenerator.accessToken = 'any_token'
  return tokenGenerator
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}

const makeLoadUserByEmailRespositorySpy = () => {
  class LoadUserByEmailRespositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRespositorySpy = new LoadUserByEmailRespositorySpy()
  loadUserByEmailRespositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRespositorySpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  return new UpdateAccessTokenRepository()
}

const makeSut = () => {
  const encrypeterSpy = makeEncryper()
  const loadUserByEmailRespositorySpy = makeLoadUserByEmailRespositorySpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase({
    loadUserByEmailRespository: loadUserByEmailRespositorySpy,
    encrypeter: encrypeterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })
  return {
    sut,
    loadUserByEmailRespositorySpy,
    encrypeterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('Auth UseCase', () => {
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
  test('should return null if a invalid email is provided', async () => {
    const { sut, loadUserByEmailRespositorySpy } = makeSut()
    loadUserByEmailRespositorySpy.user = null
    const acessToken = await sut.auth('invalid_email@email.com', 'password')
    expect(acessToken).toBeNull()
  }
  )
  test('should return null if a invalid password is provided', async () => {
    const { sut, encrypeterSpy } = makeSut()
    encrypeterSpy.isValid = false
    const acessToken = await sut.auth('valid@email.com', 'invalid_password')
    expect(acessToken).toBeNull()
  })
  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRespositorySpy, encrypeterSpy } = makeSut()
    await sut.auth('valid@email.com', 'any_password')
    expect(encrypeterSpy.password).toBe('any_password')
    expect(encrypeterSpy.hashedPassword).toBe(loadUserByEmailRespositorySpy.user.password)
  })
  test('should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRespositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid@email.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRespositorySpy.user.id)
  })
  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid@email.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRespositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRespositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })
  test('should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const loadUserByEmailRespository = makeLoadUserByEmailRespositorySpy()
    const encrypeter = makeEncryper()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ loadUserByEmailRespository: null }),
      new AuthUseCase({ loadUserByEmailRespository: invalid }),
      new AuthUseCase({ loadUserByEmailRespository }),
      new AuthUseCase({
        loadUserByEmailRespository,
        encrypeter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRespository,
        encrypeter
      }),
      new AuthUseCase({
        loadUserByEmailRespository,
        encrypeter,
        tokenGenerator: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('email@email.com', 'password')
      await expect(promise).rejects.toThrow()
    }
  })
  test('should throw if dependency throws', async () => {
    const loadUserByEmailRespository = makeLoadUserByEmailRespositorySpy()
    const encrypeter = makeEncryper()
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRespository: makeLoadUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRespository,
        encrypeter: makeEncryperWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRespository,
        encrypeter,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('email@email.com', 'password')
      await expect(promise).rejects.toThrow()
    }
  })
})
