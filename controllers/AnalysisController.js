const mongoose = require('mongoose');
const Category = require('../schemas/categorySchema');
const User = require('../schemas/userSchema')

const countStudents = async (req, res) => {
    const params = req.query
    try {
        const data = await User.where({currentStatus: new mongoose.Types.ObjectId(params.id)}).count()
        return res.status(200).send({data: data})
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
    }
}

const getAnalysis = async (req, res) => {
    const params = req.query
    try {
        let categoryNames = []
        let teacherCounts = []
        
        // Get categories based on query parameters
        const categories = await Category.where(params)
        let nonTeaching = 0;
        let teaching = 0;
        // For each category, count users with position matching the category ID
        await Promise.all(categories.map(async (category) => {
            // Count teachers with this position who are approved
            const count = await User.count({
                position: new mongoose.Types.ObjectId(category._id), 
                isApprove: true,
                role: "TEACHER" // Ensure we're only counting teachers
            })
            
            categoryNames.push(category.name)
            teacherCounts.push(count)

            if(category.position == 'TEACHING'){
                teaching += count;
            }
            if(category.position == 'NON_TEACHING'){
                nonTeaching += count;
            }

        }))

        
        const data = {
            categories: categoryNames,
            studentsData: teacherCounts,
            nonTeaching,
            teaching
        }
        
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}

const getStudentsData = async (req, res) => {
    const params = req.query
    try {
        const male = await User.count({role:'TEACHER', gender: 'male', isApprove: true})
        const female = await User.count({role:'TEACHER', gender: 'female', isApprove: true})
        const totalStudents = await User.count({role:'TEACHER', isApprove: true})
        const totalTeachers = await User.count({role:'TEACHER', isApprove: true})

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
exports.countStudents = countStudents