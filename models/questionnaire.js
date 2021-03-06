var mongoose = require("mongoose");

var questionnaireSchema = new mongoose.Schema({
    q_id: {type: mongoose.Schema.ObjectId, default:null},
    type: {type: String, required: true},
    teamId: {type: mongoose.Schema.ObjectId, ref:"team"},
    isSubmitted: {type: Boolean, default: false}
});

module.exports = mongoose.model("questionnaire", questionnaireSchema);