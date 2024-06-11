const Group = require('../models/groupsModel')

// Get All
const getAllGroups = () => {
    return Group.find();
};

// Get By ID
const getGroupById = (id) => {
    return Group.findById(id);
};

// Post
const addGroup = async (obj) => {
    const group = new Group(obj);
    const resp = await group.save();
    return resp._id;
};

// Put
const updateGroup = async (id, obj) => {
    await Group.findByIdAndUpdate(id, obj);
    return 'Updated!';
};

// Delete
const deleteGroup = async (id) => {
    await Group.findByIdAndDelete(id);
    return 'Deleted!';
};

module.exports = {
    getAllGroups,
    getGroupById,
    addGroup,
    updateGroup,
    deleteGroup
};