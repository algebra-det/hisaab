const express = require("express");
const app = express();
const port = 8000;
const db = require("./database");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();

const authenticateDB = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    require("./models");
    db.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
authenticateDB();

// For parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("First Middle Ware", req.query, req.body);
  next();
});

const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/transactions", authMiddleware, homeRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ messagee: "Something went wronng!" });
});

app.use((req, res, next) => {
  res.status(404).send({ message: "No Page found" });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
