const request = require('supertest')
const app = require('../config/app')

describe('Json paser Middleware', () => {
  test('Should parse Body as Json', async () => {
    app.post('/test_json_paser', (req, res) => {
      return res.send(req.body)
    })
    await request(app)
      .post('/test_json_paser')
      .send({ name: 'Felipe' })
      .expect({ name: 'Felipe' })
  })
})
