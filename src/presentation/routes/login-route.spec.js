const LoginRouter = require('./login-router.js')
const { ServerError, UnauthorizeError } = require('../errors')
const { InvalidParamError, MissingParamError } = require('../../utils/erros')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy })
  return {
    sut, authUseCaseSpy, emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut, authUseCaseSpy
  }
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw new Error()
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  return emailValidatorSpy
}

describe('Login Router', () => {
  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = 'valid_token'
    const httpRequest = {
      body: {
        password: 'mypassword',
        email: 'teste@teste.com.br'
      }
    }
    const httpReponse = await sut.route(httpRequest)
    expect(httpReponse.statusCode).toBe(200)
    expect(httpReponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'mypassword'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no passowrd is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'anymail@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalidemail',
        password: 'passwords'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call AuthUseCase with corret params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        password: 'mypassword',
        email: 'teste@teste.com.br'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should call EmailValidator with corret params', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        password: 'mypassword',
        email: 'teste@teste.com.br'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        password: 'invalid',
        email: 'invalid@mail.com.br'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizeError())
  })

  test('Should return 500 if no AuthUseCase throws', async () => {
    const { sut } = makeAuthUseCaseWithError()
    const httpRequest = {
      body: {
        password: 'any',
        email: 'any@mail.com.br'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no EmailValidator throws', async () => {
    const autUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(autUseCaseSpy, emailValidatorSpy)
    const httpRequest = {
      body: {
        password: 'anyd',
        email: 'any@mail.com.br'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no httpResquest is provider', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no httpResquest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should throw if dependency throws', async () => {
    const invalid = {}
    const authUseCase = makeAuthUseCase()
    const suts = [].concat(
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({
        authUseCase: invalid
      }),
      new LoginRouter({
        authUseCase
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: {}
      })

    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          password: 'any',
          email: 'any@mail.com.br'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    }
  })
})
