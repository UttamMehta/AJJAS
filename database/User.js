const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    _id: ObjectId,
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema); // collection - users

module.exports = {
  User,
};
