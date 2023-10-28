const jwt = require("jsonwebtoken");
const checkTokenAndRole = (rolesToCheck) => {
  return (req, res, next) => {
    let token = req.headers.authorization;
    console.log("token is : ", token, typeof token);

    if (token) {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("token is 1: ", token, typeof token);
      try {
        const decode = jwt.verify(token, process.env.JWT_LOGIN_TOKEN);
        if (!rolesToCheck.includes(decode.role))
          res.status(401).json({
            auth: false,
            data: "Not Authorized",
          });
        req.user = decode;
        next();
      } catch (error) {
        console.log("error: ", error);
        res.status(401).json({
          auth: false,
          data: "Invalid Token",
        });
      }
    } else {
      res.status(401).json({
        auth: false,
        data: "No Token Found in request",
      });
    }
  };
};

module.exports = { checkTokenAndRole };
