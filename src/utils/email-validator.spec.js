jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}
))

const EmailValidator = require('./email-validator')
const { MissingParamError } = require('../utils/erros')
const validator = require('validator')

describe('Email Validator', () => {
  const makeSut = () => {
    return new EmailValidator()
  }

  test('Should return true if validator retrun true ', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator retrun false ', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any@mail.com')
    expect(validator.email).toBe('any@mail.com')
  })

  test('Should throw if no email is provided', () => {
    const sut = makeSut()
    expect(sut.isValid).toThrow(new MissingParamError('email'))
  })
})
