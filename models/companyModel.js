var mongoose=require('mongoose');

var companySchema = new mongoose.Schema({
  companyName:      {type: String, lowercase: true, required: true},
  companyEmail:     {type: String, lowercase: true, required: true},
  companyContact:   Number,
  interestedFields: [{type:String}]
});

module.exports = mongoose.model('company', companySchema);