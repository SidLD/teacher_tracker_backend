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
  getUserStatus,
  getPendingUser,
  deleteUser,
  fetchUsers
} = require("../controllers/UserController");

app.get("/status", getUserStatus)
app.delete("/status", removeStatus)
app.put("/status", addUserStatus)

app.post("/register", register);
app.post("/login", login)
app.get("/user", fetchUser)
app.put("/user", updateUser)
app.delete("/user", deleteUser)

app.get("/users", fetchUsers)


app.get("/user/approve", getPendingUser)
app.put("/user/approve", approveUser)

module.exports = app;
