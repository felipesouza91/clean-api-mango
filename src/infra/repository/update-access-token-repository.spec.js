const MongoHelp = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
const { MissingParamError } = require('../../utils/erros')
let db

const makeSut = () => {
  const userModel = db
  const sut = new UpdateAccessTokenRepository()
  return { sut, userModel }
}

const makeFakeUser = async () => {
  const { userModel } = makeSut()
  const fakeUser = await userModel.insertOne({
    email: 'valid_email@email.com',
    password: 'hashard_password',
    name: 'Any name'
  })
  return fakeUser
}

describe('UpdateAccessToken Repository', () => {
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

  test('Should update then user with the given acessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await makeFakeUser()
    await sut.update(fakeUser.ops[0]._id, 'validToken')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updatedFakeUser.accessToken).toBe('validToken')
  })

  test('Should throw if no params is provided', async () => {
    const { sut } = makeSut()
    const fakeUser = await makeFakeUser()
    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
