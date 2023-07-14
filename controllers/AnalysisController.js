const mongoose = require('mongoose');
const Category = require('../schemas/categorySchema');
const User = require('../schemas/userSchema')

const getAnalysis = async (req, res) => {
    const params = req.query
    try {
        let cTemp = []
        let sTemp = []
        const categoryies = await Category.where(params)
        await Promise.all(categoryies.map( async (c) => {
            const users = await User.count({currentStatus: new mongoose.Types.ObjectId(c._id)})
            cTemp.push(c.name)
            sTemp.push(users)
        }))
        const data = {
            categories : cTemp,
            studentsData: sTemp
        };
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const getStudentsData = async (req, res) => {
    const params = req.query
    try {
        const male = await User.count({role:'student', gender: 'male', isApprove: true})
        const female = await User.count({role:'student', gender: 'female', isApprove: true})
        const totalStudents = await User.count({role:'student', isApprove: true})
        const totalTeachers = await User.count({role:'teacher', isApprove: true})

        const data = {
            totalMale: male,
            totalFemale: female,
            totalStudents : totalStudents,
            totalTeachers: totalTeachers
        }
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}

const getBatchData = async (req, res) => {
    const params = req.query
    try {
        const batches = await User.find({})
            .select('batch')
            .distinct('batch')
            .exec().then( async (docs) => docs);

        const categories = await Category.find({})
            .select('name _id')
            .exec().then( async (docs) => docs);
        let usersCounts = []
        await Promise.all(
            categories.map(async (category) => {
                let temp = []
                await Promise.all(
                    batches.map( async (batch) => {
                        await User.count({batch: batch, currentStatus: category._id})
                        .then((count) => {
                            temp.push({
                                batch: batch,
                                count: count
                            })
                        })
                    })
                ) 
                usersCounts.push({
                    category: category.name,
                    batchCounts: temp
                })
            })
        );

        const data = {
            batches: batches,
            categories: categories.map(c => c.name),
            dataSource: usersCounts
        }
        return res.status(200).send({data: data})
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
    }
}


exports.getBatchData = getBatchData
exports.getStudentsData = getStudentsData
exports.getAnalysis = getAnalysis