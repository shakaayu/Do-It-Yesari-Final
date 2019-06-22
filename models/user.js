var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    password: String,
    email: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    firstName: String,
    lastName: String,
    contact: String,
    address: String,
    town: String,
    myProfile: String,
    materials: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Material"
      }
    ]
  },
  { runSettersOnQuery: true }
);

module.exports = mongoose.model("User", imageSchema);

module.exports.getImages = function(callback, limit) {
  User.find(callback).limit(limit);
};
