const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    conversations: [],
    blocked: [],
    groups: [],
  },
  { versionKey: false }
);

const User = mongoose.model("user", userSchema, "users");

module.exports = User;
