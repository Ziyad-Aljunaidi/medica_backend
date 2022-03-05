const functions = require("firebase-functions");

const express = require("express");
const req = require("express/lib/request");
// require("dotenv").config();

const webApp = express();

webApp.use(express.urlencoded({
  extended: true,
}));

// const PORT = 5000;

webApp.get("/", (req, res) => {
  res.send("Hello World!");
});

webApp.get("/meow", (req, res) => {
  res.json([{cat: "meow"}]);
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.webApp = functions.https.onRequest(webApp);

/*
webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`)
});
*/


