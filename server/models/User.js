
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
  instagramId: String,
  accessToken: String,
  username: String,
  profilePicture: String
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
