const request = require('supertest')
const app = require('./app')
describe('App Setup', () => {
  test('Should disable x-powered-by header', async () => {
    app.get('/test_x_powered_by', (req, res) => {
      return res.json('Ola')
    })
    const response = await request(app).get('/test_x_powered_by')
    expect(response.header['x-powered-by']).toBeUndefined()
  })
})
