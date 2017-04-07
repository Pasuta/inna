'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const OrderSchema = new Schema({
  ID: {type: Number, unique: true},
  deliveryAddress: {type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  good: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Good' }],
  created: { type: Date, default: Date.now }
});

OrderSchema.pre("save", function (next) {
  if(!this.ID) this.ID = new Date().getTime();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
