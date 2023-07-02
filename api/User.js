const express = require("express");
const app = express();

// const verifyToken = require("../Utilities/VerifyToken");

const {
  register,
  login,
  approveUser,
  fetchUser,
  addStatus,
  removeStatus,
  updateUser
} = require("../controllers/UserController");

app.post("/removeUserStatus", removeStatus)
app.post("/addUserStatus", addStatus)
app.post("/register", register);
app.post("/login", login)
app.post("/approveUser", approveUser)
app.get("/user", fetchUser)
app.put("/user", updateUser)

module.exports = app;
