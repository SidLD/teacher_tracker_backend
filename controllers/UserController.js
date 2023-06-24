const { checkUser, createUser } = require('../repository/UserRepository');
const User = require('../schemas/userSchema')
const register = async (req, res) => {
    const params = req.body;
    try {
        const user = await checkUser({email: params.email, schoolId: params.schoolId})
        if(user) {
            res.status(400).send({message:"User already Exist"})
        }else{
            const data = await createUser(params);
            return res.status(200).send({data: data}) 
        }
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
}

exports.register = register