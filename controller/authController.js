const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {
  hashString,
  compareOtherStringWithHashedString
} = require('../helpers')

const validateSignupData = async (req, res) => {
  const { name, email, password } = req.body

  if (name.trim().length === 0) {
    res.status(400).json({ message: 'Please Enter a Name' })
    return false
  }

  if (password.trim().length === 0) {
    res.status(400).json({ message: 'Please Enter password' })
    return false
  } else if (password.trim().length <= 5) {
    res.status(400).json({ message: 'Minimum password length is 6 characters' })
    return false
  }

  // check if email exists in DB!
  const existingUser = await User.findOne({ where: { email: email } })
  if (existingUser) {
    res
      .status(400)
      .json({ message: 'Email Already Registered', fieldName: 'email' })
    return false
  }

  return true
}

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate Inputs
    const isValid = await validateSignupData(req, res)
    if (isValid) {
      try {
        const hashedPassword = await hashString(password)
        try {
          console.log('cred: ', email, password)
          const user = await User.create({
            name,
            email,
            password: hashedPassword,
            active: true
          })
          return res.json({
            message: 'Account Created Successfully',
            user: { id: user.id, name: user.name, email: user.email }
          })
        } catch (error) {
          return res.status(500).json({ message: error?.errors })
        }
      } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    // check if email exists in DB!
    const dbUser = await User.findOne({
      where: { email: email },
      attributes: {
        include: ['password']
      }
    })
    if (dbUser) {
      const match = await compareOtherStringWithHashedString(
        password,
        dbUser.password
      )

      if (match) {
        if (!dbUser.active)
          return res.status(403).json({
            message: 'a/c not active, please contact admin for a/c activation.'
          })
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
        res.json({
          data,
          message: 'Login Successful'
        })
      } else res.status(400).json({ message: 'Username or Password incorrect' })
    } else res.status(400).json({ message: 'Username or Password incorrect' })
  } catch (error) {
    console.log('error occured: ', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const verify = (req, res) => {
  let { token } = req.body
  if (!token) token = req.headers.authorization
  if (token) {
    try {
      const decode = jwt.verify(
        token.split(' ')[1],
        process.env.JWT_LOGIN_TOKEN
      )

      return res.json({
        auth: true,
        data: { ...decode, token }
      })
    } catch (error) {
      return res.status(401).json({
        auth: false,
        data: error.message
      })
    }
  } else {
    return res.status(401).json({
      auth: false,
      data: 'No Token Found in request'
    })
  }
}

module.exports = {
  signUp,
  login,
  verify
}
