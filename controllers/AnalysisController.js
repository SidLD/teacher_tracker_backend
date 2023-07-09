const mongoose = require('mongoose');
const Category = require('../schemas/categorySchema');

const getAnalysis = async (req, res) => {
    const params = req.query
    try {
        const data = await fetchCategory(params)
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}


exports.getAnalysis = getAnalysis