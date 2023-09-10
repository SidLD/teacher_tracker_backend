let users =  {}
const maxAttempt = 5

Date.prototype.addHours = (h) => {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }

const addAttempt = (schoolId) => {
    if(users[schoolId]){
        users[schoolId] = {
            attempt: users[schoolId].attempt + 1,
            historyAttempt : users[schoolId].historyAttempt,
            attemptDate : users[schoolId].attemptDate
        }
    }else{
        users[schoolId] = {
            attempt: 1,
            historyAttempt : 1,
            attemptDate :  new Date()
        }
    }
}

const deleteUser = (schoolId) => {
    delete users[schoolId];
}

const canAttempt = (schoolId) => {
    try {
        if(users[schoolId]){
            const attempts = users[schoolId].attempt;
            let isAttemptAvailable = attempts < maxAttempt 
            
            if(!isAttemptAvailable) {
                const prevAttemptedDate = new Date(users[schoolId].attemptDate)
                
                if(prevAttemptedDate <= new Date()){
                    return false
                }else{
                    let historyAttempt = users[schoolId].historyAttempt * 2
                    let thisDate = new Date()
                    thisDate.setHours((thisDate.getHours() * historyAttempt))

                    users[schoolId] = {
                        attempt: 1,
                        historyAttempt :historyAttempt,
                        attemptDate: thisDate
                    }
                    console.log(users[schoolId])
                    
                    return true
                }
            }else{
                addAttempt(schoolId)
                return true
            }
        }else{
            addAttempt(schoolId)
            return true
        }
    } catch (error) {
        return false
    }
}

const getUserAttempt = (schoolId) => {
    return users[schoolId]
}

exports.addAttempt = addAttempt
exports.getUserAttempt =getUserAttempt
exports.canAttempt = canAttempt
exports.deleteUser = deleteUser