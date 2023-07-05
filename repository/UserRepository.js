
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
        batch: params.batch,
        isApprove: false,
    });
    return await dbUser.save()
   } catch (error) {
        return error
   }
}

exports.getUser = getUser;
exports.createUser = createUser;