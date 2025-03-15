
const User = require("../schemas/userSchema");
const bcrypt = require('bcrypt')
const getUser = async (params) => {
    const user = await User.findOne(params)
    return user;
}
const createUser = async (params) => {
   try {
    const hashedPassword = await bcrypt.hash('password', 10);
    const dbUser = new User({
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName !== undefined ? params.middleName : "",
        email: params.email,
        contact: params.contact,
        password: hashedPassword,
        position: params.position,
        gender: params.gender,
        role: 'TEACHER',
        age: params.age,
        isApprove: false,
    });
    return await dbUser.save()
   } catch (error) {
        return error
   }
}

exports.getUser = getUser;
exports.createUser = createUser;