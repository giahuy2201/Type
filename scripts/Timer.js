// -------------------------------------
// Timer model
// -------------------------------------

export default class Timer {
  constructor(document, page, wpm) {
    this.document = document;
    this.page = page;
    this.wpm = wpm;
    this.started = false;
  }

  set display(bool) {
    const value = bool ? 'visible' : 'hidden';
    this.document.style.setProperty('visibility', value);
  }

  start() {
    if (this.started) {
      return;
    }
    this.reset();
    this.started = true;
    this.display = true;
    const countdown = setInterval(() => {
      if (this.duration === 1) {
        clearInterval(countdown);
        this.wpm.show();
        this.display = false;
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
    this.duration = 60;
    this.started = false;
    this.wpm.reset();
    this.update();
  }

  listen() {
    this.page.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.altKey) {
        if (this.duration === 1) {
          this.reset();
        }
      }
    });
  }
}
