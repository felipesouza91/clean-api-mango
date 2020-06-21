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
