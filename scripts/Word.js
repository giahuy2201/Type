import randomWords from 'random-words';

// -------------------------------------
// Word model
// -------------------------------------

export default class Word {
  constructor(document = undefined) {
    this.document = document;
  }

  get text() {
    return this.document.innerHTML;
  }

  addClass(className) {
    this.document.classList.remove(className);
    this.document.classList.add(className);
  }

  removeClass(className) {
    this.document.classList.remove(className);
  }

  // Generate words with conditions
  static generate(number, { easyMode, leftHandMode, rightHandMode }) {
    const list = [];
    for (let i = 0; i < number; i += 1) {
      const word = randomWords();
      if (easyMode === true) {
        // console.log(word+': '+word.length);
        // Check easy
        if (word.length > 6) {
          // Try again
          i -= 1;
          continue;
        }
      }
      if (leftHandMode !== rightHandMode) {
        let keyList = [];
        if (leftHandMode === true) {
          keyList = [
            'q',
            'w',
            'e',
            'r',
            't',
            'a',
            's',
            'd',
            'f',
            'g',
            'z',
            'x',
            'c',
            'v',
            'b'
          ];
        } else {
          keyList = ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'];
        }
        let j = 0;
        for (; j < word.length; j += 1) {
          if (!keyList.includes(word[j].toLowerCase())) {
            break;
          }
        }
        if (j < word.length) {
          i -= 1;
          continue;
        }
        // console.log(word)
      }
      list.push(word);
    }
    return list;
  }
}
