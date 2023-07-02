const mongoose = require('mongoose');
const {createCategory, fetchCategory} =  require('../repository/CategoryRepository');
const Category = require('../schemas/categorySchema');

const getCategory = async (req, res) => {
    const params = req.query
    try {
        const data = await fetchCategory(params)
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const category = async (req, res) => {
    const params = req.body;
    try {
        const data = await createCategory({name: params.category})
        return res.status(200).send({data: data})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const removeCategory = async (req, res) => {
    try {
        const params = req.body
        const result = await Category.deleteOne({_id:new mongoose.Types.ObjectId(params.categoryId)})
        return res.status(200).send({data: result})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const updateCategory = async (req, res) => {
    try {
        const params = req.body
        let data = await Category.findOne({_id: new mongoose.Types.ObjectId(params.categoryId)})
        data.name = params.name
        data.type = params.type
        data.save()
        .then((result) => {
            return res.status(200).send({data: result})
        })
        .catch((err) => {
            return res.status(400).send({data: err.message})
        })
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}



// const addStatus = async (req, res) => {
//     const params = req.body
//     try {
//         const data = await Category.findOne({_id: params.categoryId})
//         const types = data.type;
//         if(types){
//             data.type = [...types, params.type]   
//         }else{
//             data.type = [params.type]
//         }
//         return res.status(200).send({data: await data.save()})
//     } catch (error) {
//         return res.status(400).send({data: error.message})
//     }
// }
// const removeStatus = async (req, res) => {
//     const params = req.body
//     try {
//         const data = await Category.findOne({_id: params.categoryId})
//         const types = data.type;
//         const newTypes = types.filter((t) => {
//             if(t !== params.type){
//                 return t
//             }
//         })
//         data.type = newTypes
//         return res.status(200).send({data: await data.save()})
//     } catch (error) {
//         return res.status(400).send({data: error.message})
//     }  
// }
//type = old type
//newType = new Type
// const updateStatus = async (req, res) => {
//     const params = req.body
//     try {
//         const data = await Category.findOne({_id: params.categoryId})
//         const types = data.type;
//         const newTypes = types.map((t) => {
//             if(t === params.type){
//                 return params.newType
//             }else{
//                 return t
//             }
//         })
//         data.type = newTypes
//         return res.status(200).send({data: await data.save()})
//     } catch (error) {
//         return res.status(400).send({data: error.message})
//     }  
// }
exports.updateCategory = updateCategory;
exports.removeCategory = removeCategory;
// exports.updateStatus = updateStatus
// exports.removeStatus = removeStatus
// exports.addStatus = addStatus
exports.category = category
exports.getCategory = getCategory