function countdownTimer(customCountdownHours) {
  let targetDate = new Date(customCountdownHours+'Z');
  let berlinTime = targetDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
  const berlinDate = new Date(berlinTime);
  berlinDate.setHours(berlinDate.getHours() - 1);
  setInterval(function() {
    let currenttime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
    const currentCET = new Date(Date.parse(currenttime));
    let distance = berlinDate - new Date(currentCET);
    if (distance > 0) {
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("days").innerText = days.toString().padStart(2, '0');
      document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
      document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
      document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0')
    }
  }, 1000);
}
setTimeout(function(){
  if(document.querySelector('.counter-section-wrapper')?.dataset.hours){
    countdownTimer(document.querySelector('.counter-section-wrapper').dataset.hours);
  }
},1000 ) 