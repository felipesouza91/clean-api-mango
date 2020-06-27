const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
const MongoHelp = require('../../infra/helpers/mongo-helper')
let db

describe('Login Router', () => {
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

  test('Should return 200 when valid credentials are provided', async () => {
    await db.insertOne({
      email: 'valid_email@email.com',
      password: bcrypt.hashSync('hashard_password', 10),
      name: 'Any name'
    })
    await request(app)
      .post('/api/login')
      .send({ email: 'valid_email@email.com', password: 'hashard_password' })
      .expect(200)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({ email: 'valid_email@email.com', password: 'hashard_password' })
      .expect(401)
  })
})
