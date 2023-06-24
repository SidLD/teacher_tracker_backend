const express = require("express");


const app = express();

// const verifyToken = require("../Utilities/VerifyToken");

const {
  register,
} = require("../controllers/UserController");

app.post("/register", register);

module.exports = app;
