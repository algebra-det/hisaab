const whiteList = [
  'http://localhost:3000',
  'https://frontend-hisaab.vercel.app/',
  'https://localhost:3000'
]
const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin is: ', origin)
    callback(null, true)
    // if (whiteList.indexOf(origin) !== -1) callback(null, true);
    // else callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions
