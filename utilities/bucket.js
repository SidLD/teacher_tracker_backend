let users =  {}
const maxAttempt = 5

Date.prototype.addHours = (h) => {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }

const addAttempt = (email) => {
    if(users[email]){
        users[email] = {
            attempt: users[email].attempt + 1,
            historyAttempt : users[email].historyAttempt,
            attemptDate : users[email].attemptDate
        }
    }else{
        users[email] = {
            attempt: 1,
            historyAttempt : 1,
            attemptDate :  new Date()
        }
    }
}

const deleteUser = (email) => {
    delete users[email];
}

const canAttempt = (email) => {
    try {
        if(users[email]){
            const attempts = users[email].attempt;
            let isAttemptAvailable = attempts < maxAttempt 
            
            if(!isAttemptAvailable) {
                const prevAttemptedDate = new Date(users[email].attemptDate)
                
                if(prevAttemptedDate <= new Date()){
                    return false
                }else{
                    let historyAttempt = users[email].historyAttempt * 2
                    let thisDate = new Date()
                    thisDate.setHours((thisDate.getHours() * historyAttempt))

                    users[email] = {
                        attempt: 1,
                        historyAttempt :historyAttempt,
                        attemptDate: thisDate
                    }
                    console.log(users[email])
                    
                    return true
                }
            }else{
                addAttempt(email)
                return true
            }
        }else{
            addAttempt(email)
            return true
        }
    } catch (error) {
        return false
    }
}

const getUserAttempt = (email) => {
    return users[email]
}

exports.addAttempt = addAttempt
exports.getUserAttempt =getUserAttempt
exports.canAttempt = canAttempt
exports.deleteUser = deleteUser