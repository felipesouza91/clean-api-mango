const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongoHelp = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/erros')
let db

const makeSut = () => {
  const userModel = db
  const sut = new LoadUserByEmailRepository()
  return { userModel, sut }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelp.connect(process.env.MONGO_URL)
    db = await MongoHelp.getCollection('users')
  })

  beforeEach(async () => {
    await db.deleteMany()
  })

  afterAll(async () => {
    await MongoHelp.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  test('Should return null if user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashard_password',
      name: 'Any name'
    })
    const user = await sut.load('valid_email@email.com')
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
