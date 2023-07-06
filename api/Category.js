const express = require("express");
const verifyToken = require('../utilities/verifyToken')
const { 
    category, 
    getCategory, 
    updateCategory,
    removeCategory } = require("../controllers/CategoryContoller");

const app = express();

// const verifyToken = require("../Utilities/VerifyToken");
app.delete("/category", verifyToken, removeCategory)
// app.post("/updateStatus",updateStatus)
// app.post("/removeStatus", removeStatus)
app.post("/category", verifyToken, category);
app.get("/category", verifyToken, getCategory)
app.put("/category", verifyToken,updateCategory)
// app.post("/addStatus", addStatus)

module.exports = app;
