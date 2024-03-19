const mongoose = require("mongoose");
const userProductSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      quantity_received: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["waiting", "delivered", "denied"],
        default: "waiting",
      },
      quantity:{
        type:Number,
        ref:"PRODUCT",
      }
    },
  ]
});
module.exports = mongoose.model("User_Product", userProductSchema);
