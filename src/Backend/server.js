// NPM Libaries
const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
// My Files 
const apiRouter = require("./Routers/api");
const usersRouter = require("./Routers/users");
const readirectRouter = require("./Routers/redirect");
const generalErrorHandler = require("./ErrorHandlers/generalHandler");

//for DEV
const mongopassword = process.env.MONGO_SECRET_KEY || process.argv[2]; // remeber this 
const jwtSecretKey = process.env.JWT_SECRET_KEY || process.argv[3]; // remember this change

mongoose.connect(`mongodb+srv://elaygelbart:${mongopassword}@elaygelbart.qhmbq.mongodb.net/EGShortURL?retryWrites=true&w=majority`).then(() => {
  console.log("MongoDB connected");
})

const app = express();
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(express.static(`${__dirname}/../../Assest`));
app.use("/", express.static(`${__dirname}/../Frontend`, { index: false }));
app.get("/", checkAuth, (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../Frontend/index.html`));
  return
});
app.get("/login", loginAuthRedirect, (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../Frontend/auth.html`));
  return
});
app.get("/error/404", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../Frontend/notfound.html`));
  return
});

app.use("/api", apiRouter);
app.use("/users", usersRouter)
app.use("/", readirectRouter);

// Error Handler
app.use(generalErrorHandler);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`server is on ${process.env.PORT || 8080}`);
})


function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) { return res.redirect("/login") }
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      res.redirect("/login");
      return;
    }
    req.username = user.username;
    console.log("user is ok");
    next();
  });
}

function loginAuthRedirect(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    next();
    return;
  }
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      next();
      return;
    }
    res.redirect("/");
    return;
  });
}