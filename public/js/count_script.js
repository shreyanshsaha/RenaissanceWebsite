const countdown = document.querySelector('.countdown');

// Set Launch Date (ms)
const launchDate = new Date('Feb 7, 2019 00:00:00').getTime();

// Update every second
const intvl = setInterval(() => {
  // Get todays date and time (ms)
  const now = new Date().getTime();

  // Distance from now and the launch date (ms)
  const distance = launchDate - now;

  // Time calculation
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display result
  countdown.innerHTML = `
  <div class = "row justify-content-md-center mb-4">
  <div class = "col">${days}<span>Days</span></div> 
  <div class = "col">${hours}<span>Hours</span></div>
  <div class = "col">${mins}<span>Minutes</span></div>
  <div class = "col">${seconds}<span>Seconds</span></div>
  </div>
  `;

  // If launch date is reached
  if (distance < 0) {
    // Stop countdown
    clearInterval(intvl);
    // Style and output text
    countdown.style.color = '#17a2b8';
    countdown.innerHTML = 'Launched!';
  }
}, 1000);
