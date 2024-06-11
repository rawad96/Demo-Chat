const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema(
    {
        groupName: String,
        groupMembers: [],
        conversation: []
    },
    { versionKey: false }
)

const Group = mongoose.model('group', groupSchema, 'groups')

module.exports = Group