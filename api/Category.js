const express = require("express");
const { category, getCategory, addStatus, removeStatus, updateStatus } = require("../controllers/CategoryContoller");

const app = express();

// const verifyToken = require("../Utilities/VerifyToken");
app.post("/updateStatus",updateStatus)
app.post("/removeStatus", removeStatus)
app.post("/category", category);
app.get("/category", getCategory)
app.post("/addStatus", addStatus)

module.exports = app;
