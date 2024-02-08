const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { hashString, compareOtherStringWithHashedString } = require('../helpers')
const { asyncHandler, ErrorResponse, ApiResponse } = require('../utils')

const validateSignupData = async req => {
  const { name, email, password } = req.body

  if (!name.trim().length) throw new ErrorResponse(400, 'Please enter a name')

  if (!password.trim().length)
    throw new ErrorResponse(400, 'Please Enter password')
  else if (password.trim().length <= 5)
    throw new ErrorResponse(400, 'Minimum password length is 6 characters')

  const existingUser = await User.findOne({ where: { email: email } })
  if (existingUser) throw new ErrorResponse(400, 'Email Already Registered')
}

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validate Inputs
  await validateSignupData(req)
  const hashedPassword = await hashString(password)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    active: true
  })
  return res.json(new ApiResponse(user))
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const dbUser = await User.findOne({
    where: { email: email },
    attributes: {
      include: ['password']
    }
  })
  if (!dbUser) throw new ErrorResponse(400, 'Username or Password incorrect')
  const match = await compareOtherStringWithHashedString(
    password,
    dbUser.password
  )

  if (!match) throw new ErrorResponse(400, 'Username or Password incorrect')
  if (!dbUser.active)
    throw new ErrorResponse(
      403,
      'a/c not active, please contact admin for a/c activation.'
    )
  console.log('cred: ', email, password)
  const token = jwt.sign(
    { id: dbUser.id, name: dbUser.name, email, role: dbUser.role },
    process.env.JWT_LOGIN_TOKEN,
    { expiresIn: '30d' }
  )
  const data = {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    token
  }
  res.json(new ApiResponse(data, 200, 'Login Successful'))
})

const verify = asyncHandler(async (req, res) => {
  let { token } = req.body
  if (!token) token = req.headers.authorization
  if (!token) throw new ErrorResponse(401, 'No Token Found in request')
  const decode = jwt.verify(token.split(' ')[1], process.env.JWT_LOGIN_TOKEN)

  res.json(new ApiResponse({...decode, token}))
})

module.exports = {
  signUp,
  login,
  verify
}
