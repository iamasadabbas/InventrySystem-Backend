const mongoose = require("mongoose");
const demandProductSchema = new mongoose.Schema({
  product_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  quantity: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Demand", demandProductSchema);
