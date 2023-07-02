const express = require("express");
const { 
    category, 
    getCategory, 
    updateCategory,
    removeCategory } = require("../controllers/CategoryContoller");

const app = express();

// const verifyToken = require("../Utilities/VerifyToken");
app.delete("/category", removeCategory)
// app.post("/updateStatus",updateStatus)
// app.post("/removeStatus", removeStatus)
app.post("/category", category);
app.get("/category", getCategory)
app.put("/category",updateCategory)
// app.post("/addStatus", addStatus)

module.exports = app;
