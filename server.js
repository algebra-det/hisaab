const path = require("path");
const express = require("express");
const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("First Middle Ware", req.query, req.body);
  next();
});

const baseRouter = require("./routes/base");
const adminRouter = require("./routes/admin");
const rootDir = require("./utils/path");

app.use("/admin", adminRouter);
app.use("/", baseRouter);

app.use((req, res, next) => {
  res.status(200).sendFile(path.join(rootDir, "views", "404", "404.html"));
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
