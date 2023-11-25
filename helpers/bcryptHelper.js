const bcrypt = require('bcrypt')

const saltRounds = 10

const hashString = async string => {
  return await bcrypt.hash(string, saltRounds)
}

const compareOtherStringWithHashedString = async (string, hashedString) => {
  return await bcrypt.compare(string, hashedString)
}

module.exports = {
  hashString,
  compareOtherStringWithHashedString
}
