class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  const makeSut = () => {
    return new EmailValidator()
  }

  test('Should return true if validator retrun true ', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })
})
