const { default: mongoose } = require('mongoose');
const { getUser, createUser } = require('../repository/UserRepository');
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { addAttempt, canAttempt, getUserAttempt } = require('../utilities/bucket');

const register = async (req, res) => {
    const params = req.body;
    try {
        const ifEmail = await getUser({email: params.email})
        if(ifEmail) {
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
        if(canAttempt(params.email)){
            const user = await User.findOne({email: params.email});
            console.log(user)
            if(user){
                bcrypt.compare(params.password, user.password)
                .then((data) => {
                   if(data){
                    const payload = {
                        id: user._id,
                        firstName: user.firstName,
                        middleName: user.middleName,
                        lastName: user.lastName,
                        role: user.role,
                        email: user.email,
                        isApprove: user.isApprove
                      };
                      jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: "3hr" },
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
                    return res.status(400).send({data: "Incorrect Login, Attempt "+ getUserAttempt(params.email).attempt})
                }
                })
                .catch((err) => {
                    return res.status(400).send({data: err.message})
                })
            
            }else{
                return res.status(400).send({data: "Incorrect Login, Attempt "+ getUserAttempt(params.email).attempt})
            }
        }else{
            return res.status(400).send({
                data: "No More Attempts " +
                " come again in " +
                getUserAttempt(params.email).historyAttempt + " hrs"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
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
        if(req.user.role != "student"){
            const params = req.query;
            const payload = {
                _id: new mongoose.Types.ObjectId(params.userId)
            }
            const result = await getUser(payload);
            if(result){
                result.password = undefined
                result.status = undefined
                return res.status(200).send({data: result})
            }else{
                return res.status(400).send({data: "User Not Found"})
            }
        }else{
            const params = req.query;
            const payload = {
                _id: new mongoose.Types.ObjectId(req.user.id)
            }
            const result = await getUser(payload);
            if(result){
                result.password = undefined
                result.status = undefined
                return res.status(200).send({data: result})
            }else{
                return res.status(400).send({data: "User Not Found"})
            }
        }
    } catch (error) {
        return res.status(400).send({data: error.message})
    }
} 

const fetchUsers = async (req, res) => {
    try {
        let params = req.query;
        const limit = params?.limit 
        const start = params?.start
        delete params.limit
        delete params.start
        let query
        console.log(params)
        if(params.currentStatus){
            if(params.search){
                query = {
                    $or: [
                        {$and: [
                            { isApprove: true , 
                                role: params.role, 
                                currentStatus :  new mongoose.Types.ObjectId(params.currentStatus)},
                            { lastName: params.search}
                        ]},
                        {$and: [
                            { isApprove: true , 
                                role: params.role , 
                                currentStatus : new mongoose.Types.ObjectId(params.currentStatus)},
                            { firstName: params.search}
                         ]},
                         {$and: [
                            { isApprove: true , 
                                role: params.role, 
                                currentStatus :  new mongoose.Types.ObjectId(params.currentStatus)},
                            { batch: params.search}
                        ]},
                    ],
                }
            }else{
                query = {
                    $or: [
                        {$and: [
                            { isApprove: true , 
                                role: params.role , 
                                currentStatus :  new mongoose.Types.ObjectId(params.currentStatus)}
                        ]},
                        {$and: [
                            { isApprove: true , 
                                role: params.role , 
                                currentStatus : new mongoose.Types.ObjectId(params.currentStatus)}
                        ]}
                    ],
                }
            }
        }else if(params.search != ""){
            query = {
                $or: [
                    {$and: [
                        { isApprove: true ,  role: params.role }, 
                        { lastName: params.search}
                    ]},
                    {$and: [
                        { isApprove: true ,  role: params.role },
                        { firstName: params.search}
                    ]},
                    {$and: [
                        { isApprove: true ,  role: params.role },
                        { batch: params.search}
                    ]},
                    
                ],
            }
        }else{
            query = {
                isApprove: true ,  role: params.role 
            }
        }
        if(req.user.role === "superadmin"){
            query = {
                role: "teacher"
            }
        }
        const result = await User.where(query)
        .populate({
            path: "currentStatus",
            select: ['_id', 'name']
        })
        .limit(limit)
        .skip(start)
        .exec().then( async (docs) => docs);
        if(result.length > 0){
           const data = result.map((user) => {
                let temp = {
                    currentStatus: user.currentStatus,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    _id : user._id,
                    batch : user.batch,
                    middleName: user.middleName
                }
                return temp
                // 64ad359ae1f4280877c9f6c0
            })
            return res.status(200).send({data: data})
        }else{
            return res.status(200).send({data: "User Not Found"})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
    }
} 
const deleteUser = async (req, res) => {
    try {
        let isApprove = false;
        const user = await User.findOne({_id:  new mongoose.Types.ObjectId(req.user.id)})
        if((user.role == "superadmin" || user.role == "teacher") && user.isApprove) {
            isApprove = true
        }
        if(isApprove){
            const {_id} = req.body;
            const result = await User.deleteOne({_id: new mongoose.Types.ObjectId(_id)})
            return res.status(200).send({data: result})
        }else{
            return res.status(400).send({data: "Access Denied"})
        }
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
                return res.status(200).send({data: result})
            })
            .catch(err => {
                return res.status(200).send({data: err.message})
            });
           
        }else{
            
        return res.status(400).send({data: "User Not Found"})
        }
        
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
        let user = await User.findOne({_id: params.userId})
        if(user.status){
            user.status = [
                ...user.status, {
                    category: new mongoose.Types.ObjectId(params.categoryId),
                    detail: params.detail,
                    date: params.date
                }
            ]
        }else{
            user.status = [{
                category: new mongoose.Types.ObjectId(params.categoryId),
                detail: params.detail,
                date: params.date
            }
            ]
        }
        //Sorting Status and adding Current Status
        user.status.sort((a,b)=>a.date.getTime()-b.date.getTime());
        user.currentStatus = new mongoose.Types.ObjectId(user.status[user.status.length - 1].category)
        let result = await user.save()
        result.password = undefined
        result.email = undefined
        return res.status(200).send({data: result})
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
    }
}
//userId
//statusId
const removeStatus = async (req, res) => {
    const params = req.body
    try {
        let user = await User.findOne({_id: params.userId})
        const newStatus = user.status.filter((t) => {
            if(params.statusId != t._id){
                return t
            }
        })
        user.status = newStatus
        user.status.sort((a,b)=>a.date.getTime()-b.date.getTime());
        user.currentStatus = new mongoose.Types.ObjectId(user.status[user.status.length - 1])
        user.save()
        .then((result) => {
            result.password = undefined
            result.email = undefined
            return res.status(200).send({data: {acknowledge: true}})
        })
        .catch((err) => {
            console.log(err)
            return res.status(400).send({data: err.message})
        })
       
    } catch (error) {
        console.log(error)
        return res.status(400).send({data: error.message})
    }
}
const getUserStatus = async (req, res) => {
    const params = req.query
    try {
        const user = await User.findOne({_id: new mongoose.Types.ObjectId(params.userId)})
            .populate({
                path: "status",
                select: ["_id", "detail", "category", "date"]
            })
            .populate({
                path: "status.category",
                select: ['_id', 'name']
            })
            .exec().then( async (docs) => docs);
            user.email = undefined
            user.password = undefined
        if(user){
            return res.status(200).send({data: user.status})
        }else{
            return res.status(400).send({data: "User Not Found"})
        }
        
    } catch (error) {
        console.log(error)
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