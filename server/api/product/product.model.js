'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  sku: String,
  name: String,
  nameLower: String,
  phone:String,
  email:String,
  slug: String,
  logo:Array,
  category: {_id: String, name: String, slug: String, category: String, parentCategory: String, },
  status: String,
  brand: {_id: String, name: String, info: String, slug: String},
  info: String,
  uid: String,
  variants: [{ sku: String, name : String, price : Number, size : String,model: String, maxSize : String, formart : String }],
  mediaKit: [{ sku: String ,name : String, price : Number, adSize : String, pricing:String ,maxSize : String, adFormat : Array ,status: { type: Boolean, default: true }}],
  callout:Array,
  stats: [{key:String, val:String}],
  features: Array,
  keyFeatures: Array,
  active: { type: Boolean, default: true },
  updated: {type: Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model('Product', ProductSchema);


