const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')
const { MissingParamError } = require('../utils/erros')
const makeSut = () => {
  const sut = new Encrypter()
  return {
    sut
  }
}

describe('Encrypter tests', () => {
  test('Should resturn true if bcrypt returns true', async () => {
    const { sut } = makeSut()
    const isTrue = await sut.compare('any_value', 'hashed_value')
    expect(isTrue).toBe(true)
  })
  test('Should return false if bcrypt returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isTrue = await sut.compare('any_value', 'hashed_value')
    expect(isTrue).toBe(false)
  })
  test('Should call bcrypt with corrects values', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
  test('Should throw if no params are provided', async () => {
    const { sut } = makeSut()
    sut.compare()
    await expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    await expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
