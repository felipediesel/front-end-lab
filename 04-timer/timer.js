class Timer {
  constructor(minutes) {
    this.minutes = minutes;
    this.timer = document.querySelector('#timer');

    this.dateLimit = this.getDateLimit();

    this.updateTimer(this.minutes * 60 * 1000);

    const intervalId = setInterval(() => {
      this.now = new Date();
      this.updateTimer(this.dateLimit - this.now);

      if (this.isCompleted()) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  isCompleted() {
    return this.dateLimit <= this.now;
  }

  getDateLimit() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + this.minutes);
    return date;
  }

  updateTimer(miliseconds) {
    let totalSeconds = 0;

    if (miliseconds > 0) {
      totalSeconds = miliseconds / 1000;
    }

    const remainingMinutes = Math.floor(totalSeconds / 60);
    const seconds = Math.ceil(totalSeconds - (remainingMinutes * 60));
    this.timer.innerText = `${remainingMinutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
  }

}
