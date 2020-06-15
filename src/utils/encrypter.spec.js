const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

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
  test('Should call bcrypt with corrects values', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
