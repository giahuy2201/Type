import Word from './Word';

// -------------------------------------
// WordBox model
// -------------------------------------

export default class WordBox {
  constructor(topDocument, botDocument, typingOptions) {
    this.typingOptions = typingOptions;
    this.topLine = topDocument;
    this.botLine = botDocument;
    this.topText = '';
    this.botText = '';
    this.iterator = 0;
  }

  // Get current word
  get currentWord() {
    return new Word(this.topLine.children[this.iterator]);
  }

  // Get the next word
  get nextWord() {
    this.iterator += 1;
    // No more word -> update
    if (this.topLine.childElementCount < this.iterator + 1) {
      this.update();
    }
    return new Word(this.topLine.children[this.iterator]);
  }

  update(optionsChanged = false) {
    // Load typing settings
    const typingModes = {};
    this.typingOptions.forEach(option => {
      const name = option.getAttribute('name');
      typingModes[name] = localStorage.getItem(name) === 'true';
      option.checked = typingModes[name];
    });
    // Get settings
    if (this.botText === '' || optionsChanged) {
      this.botText = Word.generate(16, typingModes).join(' ');
    }
    this.topText = this.botText;
    this.botText = Word.generate(16, typingModes).join(' ');
    this.iterator = 0;
    // Fit words into 2 lines
    this.calibrate();
    this.render();
  }

  // Display the wordbox
  render() {
    // Construct the top line
    const topList = this.topText.split(' ');
    const formatedTopList = [];
    topList.forEach(word => {
      formatedTopList.push(`<span class="word">${word}</span>`);
    });
    this.topLine.innerHTML = formatedTopList.join(' ');
    // Construct the bottom line
    const botList = this.botText.split(' ');
    const formatedBotList = [];
    botList.forEach(word => {
      formatedBotList.push(`<span class="word">${word}</span>`);
    });
    this.botLine.innerHTML = formatedBotList.join(' ');
  }

  // Fit words into lines
  calibrate() {
    // Display to get the overflow attribute - offsetTop
    this.render();
    // check top line
    const topWords = this.topLine.children;
    let originWord = topWords[0];
    for (let i = 0; i < topWords.length; i += 1) {
      const word = topWords[i];
      // find the breakpoint
      if (word.offsetTop > originWord.offsetTop) {
        const list = this.topText.split(' ');
        this.topText = list.splice(0, i).join(' ');
        this.botText = `${list.join(' ')} ${this.botText}`;
        break;
      }
    }
    // update to get the real change
    this.render();
    // check bottom line
    const botWords = this.botLine.children;
    originWord = botWords[0];
    for (let i = 0; i < botWords.length; i += 1) {
      const word = botWords[i];
      if (word.offsetTop > originWord.offsetTop) {
        const list = this.botText.split(' ');
        this.botText = list.splice(0, i).join(' ');
        break;
      }
    }
  }
}
