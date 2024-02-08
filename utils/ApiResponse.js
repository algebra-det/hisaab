class ApiResponse {
  constructor(data={}, statusCode=200,  message="Success") {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}

module.exports = ApiResponse
