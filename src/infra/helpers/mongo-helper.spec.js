const MongoHelp = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelp.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelp.disconnect()
  })

  test('Should reconnect when getDb is invoked and client is disconnected', async () => {
    const sut = MongoHelp
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getDb()
    expect(sut.db).toBeTruthy()
  })
})
