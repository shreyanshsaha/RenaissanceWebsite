var mongoose = require("mongoose");

var tempSchema = new mongoose.Schema({
  heading: String,
  imageUrl: String,
  description: String,
});

var tempData = [
  {
    "heading": "Heading 1",
    "imageUrl": "/images/p2.jpg",
    "description": "Lorem ipsum dolor sit amet, id lorem veritus eam, ad ius fabellas instructior. Ex eam aeterno volumus tibique, ceteros vulputate abhorreant ea cum. Qui at volumus urbanitas honestatis. Ea duo summo dissentiet repudiandae, id sumo semper essent vim, et sumo congue sententiae sit. Ad sed oblique veritus. Est in magna liberavisse."
  },
  {
    "heading": "Heading 2",
    "imageUrl": "/images/p2.jpg",
    "description": "Lorem ipsum dolor sit amet, id lorem veritus eam, ad ius fabellas instructior. Ex eam aeterno volumus tibique, ceteros vulputate abhorreant ea cum. Qui at volumus urbanitas honestatis. Ea duo summo dissentiet repudiandae, id sumo semper essent vim, et sumo congue sententiae sit. Ad sed oblique veritus. Est in magna liberavisse."
  },
  {
    "heading": "Heading 3",
    "imageUrl": "/images/p2.jpg",
    "description": "Lorem ipsum dolor sit amet, id lorem veritus eam, ad ius fabellas instructior. Ex eam aeterno volumus tibique, ceteros vulputate abhorreant ea cum. Qui at volumus urbanitas honestatis. Ea duo summo dissentiet repudiandae, id sumo semper essent vim, et sumo congue sententiae sit. Ad sed oblique veritus. Est in magna liberavisse."
  },
  {
    "heading": "Heading 4",
    "imageUrl": "/images/p2.jpg",
    "description": "Lorem ipsum dolor sit amet, id lorem veritus eam, ad ius fabellas instructior. Ex eam aeterno volumus tibique, ceteros vulputate abhorreant ea cum. Qui at volumus urbanitas honestatis. Ea duo summo dissentiet repudiandae, id sumo semper essent vim, et sumo congue sententiae sit. Ad sed oblique veritus. Est in magna liberavisse."
  },
  {
    "heading": "Heading 1",
    "imageUrl": "/images/p2.jpg",
    "description": "Lorem ipsum dolor sit amet, id lorem veritus eam, ad ius fabellas instructior. Ex eam aeterno volumus tibique, ceteros vulputate abhorreant ea cum. Qui at volumus urbanitas honestatis. Ea duo summo dissentiet repudiandae, id sumo semper essent vim, et sumo congue sententiae sit. Ad sed oblique veritus. Est in magna liberavisse."
  }
];

var model = mongoose.model("temp", tempSchema);

module.exports = model;
//model.insertMany(tempData); //! Comment THIS
/*
await Temp.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, {
  $set: {
    heading:req.body.heading,
    imageUrl:req.body.image,
    description:req.body.description
  }
}, { new: true, overwrite: true });
*/
