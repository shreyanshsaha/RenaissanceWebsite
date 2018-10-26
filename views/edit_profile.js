var profile = new Vue({
  el: "#form-create",
    data:{
      name: "",
      email: "",
      club: "",
      about: "",
      contact: "",
      skills: "",
      image: ""
    }
});

// function sync(){
//   var copy = $("#copyThis");
//   var paste = $("#pasteHere");
//   console.log(copy, paste);
//   paste.val(copy.val());
// }