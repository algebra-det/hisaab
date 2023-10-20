const express = require("express");
const app = express();
const port = 8000;
require("dotenv").config();
const db = require("./database");
const authMiddleware = require("./middleware/authMiddleware");

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

const transactionRouter = require("./routes/transactionRoutes");
const adminRouter = require("./routes/adminRoutes");
const authRouter = require("./routes/authRoutes");
const homeRouter = require("./routes/homeRoutes");

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/transactions", authMiddleware, transactionRouter);
app.use("/", homeRouter);

// Error Handler
app.use((error, req, res, next) => {
  console.error("midddleError", error.stack);
  res.status(500).json({ messagee: "Something went wronng!" });
});

app.use((req, res, next) => {
  res.status(404).send({ message: "No Page found" });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
