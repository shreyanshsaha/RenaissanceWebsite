function applyEvent(eventID) {
  var applyAlert = document.getElementById("applyAlert" + eventID);
  jQuery.post("/register/event/" + eventID, function (data) {
    if (/ERROR/i.exec(data)) {
      console.log(data);
      data = data.replace(/ERROR/i, '');
      var htmlToInsert =
        `
<div class="alert alert-danger alert-dismissible fade show" role="alert">
<strong>Error!</strong>` +
        data +
        `!
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
`;
      applyAlert.innerHTML = htmlToInsert;
    } else {
      var htmlToInsert =
        `
<div class="alert alert-success alert-dismissible fade show" role="alert">
You have successfully registered for the event!
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
`;
      applyAlert.innerHTML = htmlToInsert;
    }
  });
}

// TODO: Make this also change with no of events
// TODO: Make a function which hides every event
myFunction1();

function myFunction1() {
  jQuery("#eventCollapseDiv").collapse('hide');
  document.getElementById("event1").style.display = "block";
  document.getElementById("event2").style.display = "none";
  document.getElementById("event3").style.display = "none";
  // document.getElementById("event4").style.display = "none";
  // document.getElementById("event5").style.display = "none";
}

function myFunction2() {
  jQuery("#eventCollapseDiv").collapse('hide');
  document.getElementById("event1").style.display = "none";
  document.getElementById("event2").style.display = "block";
  document.getElementById("event3").style.display = "none";
  // document.getElementById("event4").style.display = "none";
  // document.getElementById("event5").style.display = "none";
}

function myFunction3() {
  jQuery("#eventCollapseDiv").collapse('hide');
  document.getElementById("event1").style.display = "none";
  document.getElementById("event2").style.display = "none";
  document.getElementById("event3").style.display = "block";
  // document.getElementById("event4").style.display = "none";
  // document.getElementById("event5").style.display = "none";
}