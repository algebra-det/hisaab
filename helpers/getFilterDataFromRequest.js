const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

const getFilterDataFromRequest = (req, res, defaultDateRange = 'day') => {
  let { dateRange, workingDate, limit, offset } = req.query
  if (!dateRange) dateRange = defaultDateRange
  if (!workingDate) workingDate = dayjs().format('YYYY-MM-DD')
  if (!offset) offset = 0
  if (!limit) limit = 10
  else if (!['day', 'week', 'month', 'year'].includes(dateRange)) {
    return res.status(400).json({
      message:
        "Date Range sent is not valid. Valid options: ['day', 'week', 'month', 'year']",
    })
  }
  let startTime = dayjs(workingDate).tz('UTC').format()
  let endTime = dayjs(workingDate).tz('UTC').format()
  let ordering = ['createdAt', 'ASC']
  if (workingDate === dayjs().format('YYYY-MM-DD') && dateRange === 'day')
    ordering = ['createdAt', 'DESC']
  return {
    startTime,
    endTime,
    ordering,
    offset,
    limit,
  }
}

module.exports = getFilterDataFromRequest
