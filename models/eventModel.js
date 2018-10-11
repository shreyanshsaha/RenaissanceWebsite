var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
  eventName: String,
  eventLocation: String,
  eventDate: String,
  eventDesc: String,
  eventImgSrc: String
});

module.exports = mongoose.model("event", eventSchema);