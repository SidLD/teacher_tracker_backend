const express = require("express");
const verifyToken = require('../utilities/verifyToken')
const { 
    category, 
    getCategory, 
    updateCategory,
    removeCategory } = require("../controllers/CategoryContoller");
const {getAnalysis} = require("../controllers/AnalysisController")
const app = express();

app.delete("/category", verifyToken, removeCategory)
app.post("/category", verifyToken, category);
app.get("/category", verifyToken, getCategory)
app.put("/category", verifyToken,updateCategory)
app.get("/analysis", verifyToken, getAnalysis)

module.exports = app;
