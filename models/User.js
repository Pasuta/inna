'use strict';
let mongoose = require('mongoose');
// const rand = require('../helpers/helpers').getRandomInt;
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  ID: {type: Number, unique: true},
  fullname: {type: String, required: true},
  address: {type: String, required: true},
  created: { type: Date, default: Date.now }
});

UserSchema.pre("save", function (next) {
  if(!this.ID) this.ID = new Date().getTime();
  next();
});

module.exports = mongoose.model('User', UserSchema);
