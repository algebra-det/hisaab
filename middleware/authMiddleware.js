const tokenCheckInHeader = (req, res) => {
  let token = req.headers.authorization;

  if (token) {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_LOGIN_TOKEN);

      req.user = {
        auth: true,
        data: decode,
      };
    } catch (error) {
      res.status(400).json({
        auth: false,
        data: "Invalid Token",
      });
    }
  } else {
    res.json({
      auth: false,
      data: "No Token Found in request",
    });
  }
};

module.exports = tokenCheckInHeader;
