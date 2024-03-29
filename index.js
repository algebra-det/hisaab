const express = require('express')
const cors = require('cors')
const app = express()
const port = 8000
require('dotenv').config()
const db = require('./database')
const corsOptions = require('./configs/corsConfig')
const { checkTokenAndRole } = require('./middleware/authMiddleware')

const authenticateDB = async () => {
  try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
    require('./models')
    db.sync({ alter: true })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
authenticateDB()

// For parsing application/json
app.use(express.json())
// app.use(cors(corsOptions));
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const transactionRouter = require('./routes/transactionRoutes')
const productRouter = require('./routes/productRoutes')
const adminRouter = require('./routes/adminRoutes')
const authRouter = require('./routes/authRoutes')
const homeRouter = require('./routes/homeRoutes')
const { errorHandler } = require('./utils')

app.use('/auth', authRouter)
app.use('/admin', checkTokenAndRole(['admin']), adminRouter)
app.use('/transactions', checkTokenAndRole(['client']), transactionRouter)
app.use('/products', checkTokenAndRole(['client']), productRouter)
app.use('/', homeRouter)

// Error Handler
app.use(errorHandler)

app.use((_req, res, _next) => {
  res.status(404).send({ message: 'No Page found' })
})

app.listen(port, () => {
  console.log('We are live on ' + port)
})
module.exports = app
