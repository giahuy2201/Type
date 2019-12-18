// -------------------------------------
// WordInput model
// -------------------------------------

export default class WordInput {
  constructor(document, wordBox, timer, wpm) {
    this.document = document;
    this.wordBox = wordBox;
    this.wpm = wpm;
    this.timer = timer;
  }

  get peekWord() {
    return this.document.value.trim();
  }

  get popWord() {
    const text = this.document.value.trim();
    this.document.value = '';
    return text;
  }

  hasNewWord() {
    if (this.document.value.includes(' ')) {
      // Prevent space spam
      if (this.document.value.trim() !== '') {
        return true;
      }
      this.document.value = '';
    }
    return false;
  }

  listen() {
    let firstStart = true;
    this.document.addEventListener('input', () => {
      // Start timer automatically
      if (firstStart) {
        this.timer.start();
        firstStart = false;
      }
      // Check input
      const currentWord = this.wordBox.currentWord;
      if (this.hasNewWord()) {
        // Compare the words
        if (this.popWord === currentWord.text) {
          currentWord.addClass('right');
          this.wpm.point += 1;
        } else {
          currentWord.removeClass('mistake');
          currentWord.addClass('wrong');
        }
        // highlight the next currentWord instead
        currentWord.removeClass('highlight');
        this.wordBox.nextWord.addClass('highlight');
      } else {
        // check if input is part of the sample currentWord
        if (currentWord.text.indexOf(this.peekWord) === 0) {
          currentWord.removeClass('mistake');
        } else {
          currentWord.addClass('mistake');
        }
        // mark it
        currentWord.addClass('highlight');
      }
    });
  }
}
