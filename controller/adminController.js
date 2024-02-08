const User = require('../models/User')
const { Op } = require('sequelize')
const { hashString } = require('../helpers')
const { asyncHandler, ErrorResponse, ApiResponse } = require('../utils')

const allUsers = asyncHandler(async (req, res, _next) => {
  let { limit, offset } = req.query
  if (!offset) offset = 0
  if (!limit) limit = 10
  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    where: {
      [Op.not]: [{ id: req.user.id }, { role: 'admin' }]
    }
  })
  const data = { rows, count }
  res.json(new ApiResponse(data, 'Fetched Successfully'))
})

const activateUser = asyncHandler(async (req, res) => {
  const { active } = req.body
  const { userId } = req.params
  if (!userId || typeof active !== 'boolean')
    throw new ErrorResponse(400, 'Please enter correct values')

  const requiredUser = await User.findByPk(userId)
  if (!requiredUser)
    throw new ErrorResponse(400, `No User found with ID ${userId}`)

  await requiredUser.update({ active })
  res.json(new ApiResponse(requiredUser, 'User Status updated successfully'))
})

const updateUser = asyncHandler(async (req, res) => {
  const userBody = req.body
  const { userId } = req.params
  delete userBody['id']
  if (!userId) throw new ErrorResponse(400, 'user id is required')
  if (userBody.password) userBody.password = await hashString(userBody.password)

  const requiredUser = await User.findByPk(userId)
  if (!requiredUser)
    throw new ErrorResponse(400, `No User found with ID ${userId}`)

  if (requiredUser.role === 'admin' || requiredUser.id === req.user.id)
    throw new ErrorResponse(400, `Not Authorized to delete such/this user(s)`)

  await requiredUser.update({ ...userBody })
  res.json(new ApiResponse(requiredUser, 'User Status updated successfully'))
})

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  if (!userId) throw new ErrorResponse(400, 'UserId is required')

  const requiredUser = await User.findByPk(userId)
  if (!requiredUser)
    throw new ErrorResponse(400, `No User found with ID ${userId}`)

  if (requiredUser.role === 'admin' || requiredUser.id === req.user.id)
    throw new ErrorResponse(400, `Not Authorized to delete such/this user(s)`)

  await requiredUser.destroy()
  res.json(new ApiResponse(requiredUser, 'User Deleted Successfully'))
})

module.exports = {
  allUsers,
  activateUser,
  deleteUser,
  updateUser
}
