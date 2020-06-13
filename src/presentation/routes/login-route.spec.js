const LoginRouter = require('./login-router.js')
const MissingParamError = require('../helpers/missing-param-error.js')
const UnauthorizeError = require('../helpers/unauthorize-error.js')
const ServerError = require('../helpers/server-error.js')
const InvalidParamError = require('../helpers/invalid-param-error.js')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut, authUseCaseSpy
  }
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

describe('Login Router', () => {
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
        email: 'mypasswor@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalidemail',
        passowrd: 'passwords'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
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
  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
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
  test('Should return 500 if no AuthUseCase has no auth method', async () => {
    class AuthUseCaseSpy { }
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
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
})
