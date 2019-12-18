// Show point
export default class WPM {
  constructor(document) {
    this.document = document;
    this.result = '';
    this.rightWords = 0;
  }

  get point() {
    return this.rightWords;
  }

  set point(rightWords) {
    this.rightWords = rightWords;
  }

  set display(bool) {
    const value = bool ? 'visible' : 'hidden';
    this.document.style.setProperty('visibility', value);
  }

  reset() {
    this.display = false;
    this.rightWords = 0;
  }

  show() {
    this.display = true;
    this.document.innerHTML = `${this.point} wpm`;
    // Save the best result
    let best = localStorage.getItem('best') || 0;
    if (this.point > best) {
      best = this.point;
      localStorage.setItem('best', best);
    }
    this.document.setAttribute('title', `Best is ${best}`);
  }
}
