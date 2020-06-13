const MissingParamError = require('../helpers/missing-param-error.js')
const UnauthorizeError = require('../helpers/unauthorize-error.js')
module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: 500
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizeError()
    }
  }
}
