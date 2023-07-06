const { default: mongoose } = require('mongoose');
const { getUser, createUser } = require('../repository/UserRepository');
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const params = req.body;
    try {
        const ifEmail = await getUser({email: params.email})
        const ifSchoolId = await getUser({ schoolId: params.schoolId})
        if(ifEmail || ifSchoolId) {
            res.status(400).send({data:"User already Exist"})
        }else{
            const data = await createUser(params);
            data.password = undefined;
            data.email = undefined
            return res.status(200).send({data: data}) 
        }
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const login = async (req, res) => {
    const params = req.body
    try {
        const user = await User.findOne({schoolId: params.schoolId});
        
        if(user){
            if(!user.isApprove){
                return res.status(400).send({data: "User Pending Approval"})
            }else{
                bcrypt.compare(params.password, user.password)
                .then((data) => {
                    console.log(data)
                   if(data){
                    const payload = {
                        id: user._id,
                        firstName: user.firstName,
                        middleName: user.middleName,
                        lastName: user.lastName,
                        role: user.role,
                        schoolId: user.schoolId,
                      };
                      jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: 86400 },
                        (err, token) => {
                          if (err) {
                            res.status(400).send({ message: err });
                          } else {
                            res.status(201).send({
                              data: "Success",
                              token: "Bearer " + token,
                            });
                          }
                        }
                      );
                   }else{
                        return res.status(400).send({data: "Incorrect Password"})
                   }
                })
                .catch((err) => {
                    return res.status(400).send({data: err.message})
                })
            }
        }else{
            return res.status(400).send({data: "User not Found"})
        }
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
}
const approveUser = async (req, res) => {
    const params = req.body
    try {
        let updatedUser = await User.findOne({_id:new  mongoose.Types.ObjectId(params.userId)})
        updatedUser.isApprove = true
        updatedUser.save()
        .then((result) => {
            result.password = undefined
            result.email = undefined
            return res.status(200).send({data: result}) 
        })
        .catch((err) => {
            return res.status(400).send({data: err.message})  
        })
        
    } catch (error) {
        return res.status(400).send({data: error.message})   
    }
}
const fetchUser = async (req, res) => {
    try {
        const params = req.query;
        const payload = {
            _id: new mongoose.Types.ObjectId(params.userId)
        }
        const result = await getUser(payload);
        if(result){
            result.password = undefined
            return res.status(200).send({data: result})
        }else{
            return res.status(400).send({data: "User Not Found"})
        }
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
} 
const fetchUsers = async (req, res) => {
    try {
        const params = req.query;
        const result = await User.where(params);
        if(result.length > 0){
           const data = result.map((user) => {
                let temp = {
                    firstName : user.firstName,
                    lastName : user.lastName,
                    _id : user._id,
                    batch : user.batch,
                    middleName: user.middleName
                }
                return temp
            })
            return res.status(200).send({data: data})
        }else{
            return res.status(200).send({data: "User Not Found"})
        }
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
} 
const deleteUser = async (req, res) => {
    try {
        const params = req.body;
        const result = await User.deleteOne({_id: new mongoose.Types.ObjectId(params.userId)})
        console.log(result)
        return res.status(200).send({data: result})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
//userId
//categoryId
//position
//description
const addUserStatus = async (req, res) => {
    const params = req.body
    try {
        const user = await User.findOne({_id: params.userId})
        if(user.status){
            user.status = [
                ...user.status, {
                category: params.categoryId,
                position: params.position,
                description: params.description,
                date: params.date
                }
            ]
        }else{
            user.status = [{
                category: params.categoryId,
                position: params.position,
                description: params.description,
                date: params.date
            }
            ]
        }
        let result = await user.save()
        result.password = undefined
        result.email = undefined
        return res.status(200).send({data: result})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
//userId
//statusId
const removeStatus = async (req, res) => {
    const params = req.body
    try {
        const user = await User.findOne({_id: params.userId})
        const newStatus = user.status.filter((t) => {
            if(t._id.toString() !== params.statusId){
                return t
            }
        })
        user.status = newStatus
        let result = await user.save()
        result.password = undefined
        result.email = undefined
        return res.status(200).send({data: result})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const updateUser = async (req, res) => {
    const params = req.body
    try {
        const user = await User.findOne({_id: new mongoose.Types.ObjectId(params.userId)})
        if(user){
            user.email = params.email ? params.email : user.email
            user.firstName = params.firstName ? params.firstName : user.firstName
            user.lastName = params.lastName ? params.lastName : user.lastName
            user.middleName = params.middleName ? params.middleName : user.middleName
            user.batch = params.batch ? params.batch : user.batch
            user.gender = params.gender ? params.gender : user.gender
            user.age = params.age ? params.age : user.age
            await user.save()
            .then(result => {
                result.password = undefined
                console.log(result)
                return res.status(200).send({data: result})
            })
            .catch(err => {
                return res.status(200).send({data: err.message})
            });
            console.log(user)
           
        }else{
            
        return res.status(400).send({data: "User Not Found"})
        }
        
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const getUserStatus = async (req, res) => {
    const params = req.query
    try {
        const user = await User.findOne({_id: new mongoose.Types.ObjectId(params.userId)})
        if(user){
            return res.status(200).send({data: user.status})
        }else{
            return res.status(400).send({data: "User Not Found"})
        }
        
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
}
const getPendingUser = async (req, res) => {
    try {
        
        let result = await User.where({isApprove:false});
        if(result.length > 0){
            result = result.map((temp) => {
                temp.password = undefined
                temp.status = undefined
                return temp;
            })
        }
        return res.status(200).send({data: result})
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
} 

exports.fetchUsers = fetchUsers
exports.deleteUser = deleteUser;
exports.getPendingUser = getPendingUser;
exports.getUserStatus = getUserStatus
exports.removeStatus = removeStatus
exports.addUserStatus = addUserStatus
exports.fetchUser = fetchUser
exports.approveUser = approveUser
exports.login = login
exports.register = register
exports.updateUser = updateUser