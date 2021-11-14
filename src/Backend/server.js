// NPM Libaries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// My Files 
const apiRouter = require("./Routers/api");
const usersRouter = require("./Routers/users");
const readirectRouter = require("./Routers/redirect");
const generalErrorHandler = require("./ErrorHandlers/generalHandler");

//for DEV
process.env.MONGO_SECRET_KEY = process.argv[2]; // remeber this 
const mongopassword = process.env.MONGO_SECRET_KEY;

mongoose.connect(`mongodb+srv://elaygelbart:${mongopassword}@elaygelbart.qhmbq.mongodb.net/EGShortURL?retryWrites=true&w=majority`).then(() => {
  console.log("MongoDB connected");
})

const app = express();
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static(`${__dirname}/../../Assest`));
app.use("/error/404", express.static(`${__dirname}/../Frontend`, { index: 'notfound.html' }));
app.use("/Mobile", express.static(`${__dirname}/../Frontend`, { index: 'MoblieIndex.html' }));
app.use("/", express.static(`${__dirname}/../Frontend`));
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/../Frontend/index.html`);
});
app.get("/error/404", (req, res) => {
  res.sendFile(`${__dirname}/../Frontend/Frontend/notfound.html`);
});
app.get("/Mobile", (req, res) => {
  res.sendFile(`${__dirname}/../Frontend/Frontend/MoblieIndex.html`);
});

app.use("/api", apiRouter);
app.use("/users", usersRouter)
app.use("/", readirectRouter);

// Error Handler
app.use(generalErrorHandler);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`server is on ${process.env.PORT || 8080}`);
})
