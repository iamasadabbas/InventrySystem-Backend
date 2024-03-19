const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  product_code:{
    type:String,
    required:true
  },
  type_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'ProductType',
    required:true
  },
  company_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Company',
    required:true
  },
  description:{
    type:String
  },
  quantity:{
    type:Number,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});
module.exports = mongoose.model("Product", productSchema);
