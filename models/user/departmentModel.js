const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true,"Department Already Register"]
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
