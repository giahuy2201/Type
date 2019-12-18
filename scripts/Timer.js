// -------------------------------------
// Timer model
// -------------------------------------

export default class Timer {
  constructor(document, page, wpm) {
    this.document = document;
    this.page = page;
    this.wpm = wpm;
    this.started = false;
    this.duration = 5;
  }

  set display(bool) {
    const value = bool ? 'visible' : 'hidden';
    this.document.style.setProperty('visibility', value);
  }

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.display = true;
    this.wpm.reset();
    const countdown = setInterval(() => {
      if (this.duration === 0) {
        clearInterval(countdown);
        this.wpm.show();
        this.reset();
      } else {
        this.duration -= 1;
      }
      this.update();
    }, 1000);
  }

  update() {
    const min = parseInt(this.duration / 60, 10);
    const sec = this.duration % 60;
    this.document.innerHTML = `${min}:${sec}`;
  }

  reset() {
    this.started = false;
    this.display = false;
    this.duration = 5;
  }

  listen() {
    this.page.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.altKey) {
        this.start();
      }
    });
  }
}
