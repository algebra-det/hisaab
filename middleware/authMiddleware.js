const jwt = require("jsonwebtoken");
const checkTokenAndRole = (rolesToCheck) => {
  return (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) token = req.cookies.authorization;
    console.log("Token : ", token);

    if (token) {
      try {
        token = token.split(" ")[1];
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
