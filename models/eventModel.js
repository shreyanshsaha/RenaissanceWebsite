var mongoose = require("mongoose");

// var eventDetails = [
// 	{
// 		eventName: "Presente Vous",
// 		eventLocation: "Vellore Institute of Technology, Chennai",
// 		// eventTime: "5 pm",
// 		eventDate: "9th February, 2019",
// 		eventDesc: "Your pitch, your win. The stage is set, it awaits the ring of your inspiration and the voices of unique minds that aim to reach out and start out on their own. Presente Vous is the ultimate place to team up and get your start up the backing it needs. Don't fret, we also have the help you might need. Mentors to guide you through the process and shape up your ideas to perfection. Some areas of prime importance will be Technology- advances in sustainability, artificial intelligence and virtual reality to name a few, as well as Finances, Education, Health and Wellness. ",
// 		eventImgSrc:"/images/samplePoster.jpg"
// 	},
// 	{
// 		eventName: "Business Carpet",
// 		eventLocation: "Vellore Institute of Technology, Chennai",
// 		// eventTime: "5 pm",
// 		eventDate: "8th February, 2019",
// 		eventDesc: "If all the world's a stage then the world is coming to VIT Chennai. A world full of entrepreneurs and exciting ventures. There's a change in the winds, so put your sails high and let the journey begin. This StartUp Expo is the place you want to be if you want some company along. They'll be here to showcase their fruits of labour and love, we'll be here to witness such beauty in real time.",
// 		eventImgSrc:"/images/samplePoster.jpg"
// 	},
// 	{
// 		eventName: "Campfire Conference",
// 		eventLocation: "Vellore Institute of Technology, Chennai",
// 		eventTime: "6 pm to 10 pm",
// 		eventDate: "8th February",
// 		eventDesc: "Education is not filling of a pail, but the lighting of the fire”.Unlike the usual round table conferences, we believe in experiencing it the right way. Around the fire, midnight, a cup of coffee and life stories, just to light up your path. Sounds exciting!Campfire conference is all about it.Networking opportunities for the young minds and a chance to hit your mentors mind right! A lifetime of an experience where you can light a fire , they can never put out!",
// 		eventImgSrc:"/images/samplePoster.jpg"
// 	},
// 	{
// 		eventName: "Magnet Moulding",
// 		eventLocation: "Amphitheater, Academic Block 1, Vellore Institute of Technology, Chennai",
// 		eventTime: "5 pm",
// 		eventDate: "7th and 8th February, 2019",
// 		eventDesc: "“Speak so that you can influence the society”. Magnate moulding is an opportunity for the mentors to share the world what it takes to be an Entrepreneur. 90 minutes and you will sparkle with the fire of want to become like them in your eyes. Converting a startup in crises into a proper business plan will let you a jist of their journey. Enough to inspire you to work hard so that your dreams can come true. Come, listen, build and enjoy the feast for the soul.",
// 		eventImgSrc:"/images/samplePoster.jpg"
// 	},
// 	{
// 		eventName: "Intership Drive",
// 		eventLocation: "Vellore Institute of Technology, Chennai",
// 		// eventTime: "",
// 		eventDate: "8th February, 2019",
// 		eventDesc: "Open your eyes, rise and shine, suit up quirky, quiet or fine. But let us remind, do not leave your cv behind.This edition of the Internship Drive comes with the promise to let you be the best while learning from the best. Theoretical knowledge is available in plenty but application is the real decider, to get yourself a rung up on the ladder. While you may be looking at some like minds, the startups may find in you their right choice. ",
// 		eventImgSrc:"/images/samplePoster.jpg"
// 	}

// ];


var eventSchema = new mongoose.Schema({
  eventName: String,
  eventLocation: String,
  eventDate: String,
  eventDesc: String,
  eventImgSrc: String,
  users:[{type:mongoose.Schema.ObjectId, ref:"user"}],
  registrationOpen: {type:Boolean, default:false},
  teamRequired: {type: Boolean, default: false}
});

module.exports = mongoose.model("event", eventSchema);