
module.exports = class UnauthorizeError extends Error {
  constructor (paramName) {
    super('Unauthorize')
    this.name = 'UnauthorizeError'
  }
}
