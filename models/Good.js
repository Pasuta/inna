'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const GoodSchema = new Schema({
  ID: {type: Number, unique: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  created: { type: Date, default: Date.now }
});

GoodSchema.pre("save", function (next) {
  if(!this.ID) this.ID = new Date().getTime();
  next();
});

module.exports = mongoose.model('Good', GoodSchema);
