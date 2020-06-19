const Jwt = require('jsonwebtoken')
const { MissingParamError } = require('./erros')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('Should return null if JWT return null', async () => {
    const sut = makeSut()
    Jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token if Jwt return token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(Jwt.token)
  })

  test('Should call JWT with corret values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(Jwt.id).toBe('any_id')
    expect(Jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secret are provide', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    await expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no id are provide', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
