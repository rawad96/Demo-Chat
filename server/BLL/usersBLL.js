const User = require("../models/usersModel")

// Get All
const getAllUsers = () => {
    return User.find();
};

// Get By ID
const getUserById = (id) => {
    return User.findById(id);
};

// Post
const addUser = async (obj) => {
    const user = new User(obj);
    await user.save();
    return 'Created!';
};

// Put
const updateUser = async (id, obj) => {
    await User.findByIdAndUpdate(id, obj);
    return 'Updated!';
};

// Delete
const deleteUser = async (id) => {
    await User.findByIdAndDelete(id);
    return 'Deleted!';
};

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
};