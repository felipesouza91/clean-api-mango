const MongoHelp = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelp.connect(process.env.MONGO_URL)
    db = await MongoHelp.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelp.disconnect()
  })
  test('Should update then user with the given acessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashard_password',
      name: 'Any name'
    })
    await sut.update(fakeUser.ops[0]._id, 'validToken')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updatedFakeUser.accessToken).toBe('validToken')
  })
})
