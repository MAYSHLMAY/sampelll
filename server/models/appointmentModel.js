const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",  // Ensure this matches your User model
      required: true,
    },
    doctorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Doctor",  // Update this to "Doctor" if you have a Doctor model
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", schema);

module.exports = Appointment;
