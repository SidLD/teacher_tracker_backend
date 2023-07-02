
const Category = require("../schemas/categorySchema");
const bcrypt = require('bcrypt')
const fetchCategory = async (params) => {
    try {
        return await Category.find(params);
    } catch (error) {
        return error
    }
}
const createCategory = async (params) => {
   try {
    const category = new Category(params);
    return await category.save()
   } catch (error) {
        return error
   }
}

exports.fetchCategory = fetchCategory
exports.createCategory = createCategory