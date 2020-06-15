const bcrypt = require('bcrypt')
class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

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
})
