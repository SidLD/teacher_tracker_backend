
const User = require("../schemas/userSchema");
const bcrypt = require('bcrypt')
const getUser = async (params) => {
    const user = await User.findOne(params)
    return user;
}
const createUser = async (params) => {
   try {
    const hashedPassword = await bcrypt.hash(params.password, 10);
    const dbUser = new User({
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName !== undefined ? params.middleName : "",
        schoolId: params.schoolId,
        email: params.email,
        password: hashedPassword,
        gender: params.gender,
        role: params.role,
        age: params.age,
        isApprove: false,
    });
    return await dbUser.save()
   } catch (error) {
        return error
   }
}
const updateUser = async (params) => {
    //Does not update role and schoolId
    const user = await User.findOne({schoolId: params.schoolId})
    user.email = params.email ? params.email : user.email
    user.firstName = params.firstName ? params.firstName : user.firstName
    user.lastName = params.lastName ? params.lastName : user.lastName
    user.middleName = params.middleName ? params.middleName : user.middleName
    user.isApprove = params.isApprove ? params.isApprove : user.isApprove
    return await user.save();
}

exports.updateUser = updateUser;
exports.getUser = getUser;
exports.createUser = createUser;