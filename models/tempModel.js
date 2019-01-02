var mongoose = require("mongoose");

var tempSchema = new mongoose.Schema({
  role: String,
  imageUrl: String,
  company: String,
  location:String,
  cost:String,
  duration:String,

});

var tempData = [
  {
    "role": "Social Media Marketing Intern",
    "imageUrl": "/images/myimage-1546366613809.jpeg",
    "company": "Zergon Bizsupport",
    "location":"Noida",
    "cost":"3000 / Month",
    "duration":"3 - 6 Months"
  },
  { "role": "Content Writer ",
  "imageUrl": "/images/myimage-1546366647746.jpeg",
  "company": "GIGGLE AND BYTES",
  "location":"Delhi",
  "cost":"3000 - 5000 / Month",
  "duration":"2 Months"
},
  { "role": "Internship In Anchoring and Reporting",
  "imageUrl": "/images/myimage-1546366673891.jpeg",
  "company": "NOW24",
  "location":"Delhi",
  "cost":"Expenses Covered",
  "duration":"3 Months"},
  { "role": "Client Acquisition Intern",
  "imageUrl": "/images/myimage-1546366660734.jpeg",
  "company": "Typho Design",
  "location":"Work From Home",
  "cost":"No Salary",
  "duration":"1 - 12 Months"}
];

var model = mongoose.model("temp", tempSchema);

module.exports = model;
// model.insertMany(tempData); //! Comment THIS
/*
await Temp.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, {
  $set: {
    heading:req.body.heading,
    imageUrl:req.body.image,
    description:req.body.description
  }
}, { new: true, overwrite: true });
*/
