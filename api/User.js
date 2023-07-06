const express = require("express");
const app = express();

const verifyToken = require('../utilities/verifyToken')

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

app.get("/status", verifyToken, getUserStatus)
app.delete("/status", verifyToken, removeStatus)
app.put("/status", verifyToken, addUserStatus)

app.post("/register", register);
app.post("/login", login)
app.get("/user", verifyToken, fetchUser)
app.put("/user", verifyToken, updateUser)
app.delete("/user", verifyToken, deleteUser)
app.get("/users", verifyToken, fetchUsers)

app.get("/user/approve", getPendingUser)
app.put("/user/approve", approveUser)

module.exports = app;
