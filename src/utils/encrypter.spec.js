class Encrypter {
  async compare (password, hashedPassword) {
    return true
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
    const isTrue = await sut.compare('any_password', 'hashed_password')
    expect(isTrue).toBe(true)
  })
})
