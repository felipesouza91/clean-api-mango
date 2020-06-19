
class TokenGenerator {
  async generate (id) {
    return null
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Should return null if JWT return null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
  test('Should return null if JWT return null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
