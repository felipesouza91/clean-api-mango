const request = require('supertest')
const app = require('../config/app')
describe('Cors Middleware', () => {
  test('Should enable Cors', async () => {
    app.get('/test_cors', (req, res) => {
      return res.json('Ola')
    })
    const response = await request(app).get('/test_x_powered_by')
    expect(response.header['access-control-allow-origin']).toBe('*')
    expect(response.header['access-control-allow-methods']).toBe('*')
    expect(response.header['access-control-allow-headers']).toBe('*')
  })
})
