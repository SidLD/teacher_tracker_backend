const express = require("express");
const app = express();

// const verifyToken = require("../Utilities/VerifyToken");

const {
  register,
  login,
  approveUser,
  fetchUser,
  addUserStatus,
  removeStatus,
  updateUser,
  getUserStatus
} = require("../controllers/UserController");

app.get("/status", getUserStatus)
app.delete("/status", removeStatus)
app.put("/status", addUserStatus)

app.post("/register", register);
app.post("/login", login)
app.post("/approveUser", approveUser)
app.get("/user", fetchUser)
app.put("/user", updateUser)

module.exports = app;
