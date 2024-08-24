const jwt = require("jsonwebtoken");
const secret = "token123@$";
// const sessionIdToUserMap = new Map();

function setUser(user){
    // sessionIdToUserMap.set(id, user)
    return jwt.sign(
    {
        _id: user._id,
        email: user.email,
    }, 
    secret);
}

function getUser(id){
    // return sessionIdToUserMap.get(id);
    if(!token) return null;

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}