var mongoose = require("mongoose");

var questionnaireSchema = new mongoose.Schema({
    q_id: {type: mongoose.Schema.ObjectId},
    type: String
});

module.exports = mongoose.model("questionnaire", questionnaireSchema);