/**
 * Typing machine
 * by giahuy2201 (giahuy2201@outlook.com)
 */

import 'bootstrap';
import '../styles/style.scss';
import randomWords from 'random-words';

// Mobile prevent
mobileWarning(document.querySelector('body'));

// -------------------------------------
// Setup variables
// -------------------------------------

let rightWords = 0; // points
const timer = new Timer(document.querySelector('#timer'), 60, displayWPM);
const wordInput = new WordInput(document.querySelector('.word-input'));
const wordBox = new WordBox(
  document.querySelector('.top'),
  document.querySelector('.bot'),
  document.querySelectorAll('.typing-option input')
);
const settingsPanel = new Settings(
  document.querySelector('body'),
  document.querySelectorAll('.typing-option input'),
  document.querySelectorAll('.dark-option input'),
  document.querySelectorAll('.theme-option')
);
wordBox.update();
settingsPanel.update();
settingsPanel.listen();
wordInput.listen(keystroke);

// -------------------------------------
// Page controls
// -------------------------------------

const panel = document.querySelector('#panel');
panel.addEventListener('mouseleave', function() {
  panel.style.setProperty('display', 'none');
});
const more = document.querySelector('#more');
more.addEventListener('mouseover', function() {
  panel.style.setProperty('display', 'block');
});

// Don't allow devices with touchscreen
function mobileWarning(page) {
  if ('ontouchstart' in document.documentElement) {
    const msg =
      'It seems like you are not using a physical keyboard! My website is truthfully made for serious coders & typers. Have fun :)';
    page.innerHTML = `<div class="shadow p-3 mb-5 bg-white rounded m-5">${msg}</div>`;
    // Terminate the program
    throw new Error('Unsupported device!');
  }
}

// Show point
function displayWPM() {
  const wpm = document.querySelector('#point');
  wpm.innerHTML = `${rightWords} wpm`;
  // Save the best result
  let best = localStorage.getItem('best') || 0;
  if (rightWords > best) {
    best = rightWords;
    localStorage.setItem('best', best);
  }
  wpm.setAttribute('title', `Best is ${best}`);
}

// -------------------------------------
// Input listener
// -------------------------------------

function keystroke() {
  // Start timer
  timer.start();
  // Check input
  const word = wordBox.get();
  if (wordInput.hasNewWord()) {
    // Compare the words
    if (wordInput.pop() === word.text()) {
      word.addClass('right');
      rightWords += 1;
    } else {
      word.removeClass('mistake');
      word.addClass('wrong');
    }
    // highlight the next word instead
    word.removeClass('highlight');
    wordBox.next().addClass('highlight');
  } else {
    // check if input is part of the sample word
    if (word.text().indexOf(wordInput.peek()) === 0) {
      word.removeClass('mistake');
    } else {
      word.addClass('mistake');
    }
    // mark it
    word.addClass('highlight');
  }
}

// -------------------------------------
// Settings model
// -------------------------------------

function Settings(page, typingOptions, darkOptions, themeOptions) {
  this.page = page;
  this.typingOptions = typingOptions;
  this.darkOptions = darkOptions;
  this.themeOptions = themeOptions;
  this.selectedTheme = null;

  // Get data from localStorage and show on option panel
  this.update = function() {
    const darkAuto = localStorage.getItem('darkAuto') === 'true';
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const themeIndex = localStorage.getItem('theme') || 0;
    const darkAutoCheck = darkOptions[1];
    const darkModeCheck = darkOptions[0];
    const darkSwitch = darkModeCheck.parentNode;
    // update switches
    darkAutoCheck.checked = darkAuto;
    darkModeCheck.checked = darkMode;
    // remove switch force class
    this.page.classList.remove('dark-mode');
    // apply to appearance
    if (darkAuto) {
      this.page.setAttribute('id', 'dark-auto');
      // disable dark switch
      darkSwitch.style.setProperty('filter', 'grayscale(100%)');
      darkModeCheck.disabled = true;
    } else {
      this.page.removeAttribute('id');
      darkSwitch.style.removeProperty('filter');
      darkModeCheck.disabled = false;
      if (darkMode) {
        this.page.classList.add('dark-mode');
      }
    }
    // theme
    themeOptions.forEach(function(option) {
      option.classList.remove('theme-selected');
    });
    let url = '';
    if (themeIndex !== 0) {
      this.selectedTheme = this.themeOptions[themeIndex - 1];
      this.selectedTheme.classList.add('theme-selected');
      url = getComputedStyle(this.selectedTheme, false).backgroundImage;
    }
    this.page.style.backgroundImage = url;
    this.page.style.backgroundSize = '200px';
  };
  // add listeners to add settings
  this.listen = function() {
    const settings = this;
    // typing options
    typingOptions.forEach(function(option) {
      option.addEventListener('click', function() {
        // Grab all checkbox info and save
        typingOptions.forEach(function(opt) {
          const name = opt.getAttribute('name');
          localStorage.setItem(name, opt.checked);
        });
        wordBox.update(true);
      });
    });
    // dark options
    darkOptions.forEach(option => {
      option.addEventListener('click', function() {
        const name = option.getAttribute('name');
        localStorage.setItem(name, option.checked);
        settings.update();
      });
    });
    // theme options
    themeOptions.forEach(function(option, index) {
      option.addEventListener('click', function() {
        if (this.classList.contains('theme-selected')) {
          localStorage.setItem('theme', '');
        } else {
          localStorage.setItem('theme', index + 1);
        }
        settings.update();
      });
    });
  };
}

// -------------------------------------
// Word model
// -------------------------------------

function Word(document = undefined) {
  this.document = document;

  this.text = function() {
    return this.document.innerHTML;
  };
  this.addClass = function(className) {
    this.document.classList.remove(className);
    this.document.classList.add(className);
  };
  this.removeClass = function(className) {
    this.document.classList.remove(className);
  };
  // Generate words with conditions
  this.generate = function(number, typingModes) {
    const { easyMode } = typingModes;
    const { leftHandMode } = typingModes;
    const { rightHandMode } = typingModes;
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
  };
}

// -------------------------------------
// WordBox model
// -------------------------------------

function WordBox(topDocument, botDocument, typingOptions) {
  this.typingOptions = typingOptions;
  this.topLine = topDocument;
  this.botLine = botDocument;
  this.topText = '';
  this.botText = '';
  this.iterator = 0;

  // Get current word
  this.get = function() {
    return new Word(this.topLine.children[this.iterator]);
  };
  // Get the next word
  this.next = function() {
    this.iterator += 1;
    // No more word -> update
    if (this.topLine.childElementCount < this.iterator + 1) {
      this.update();
    }
    return new Word(this.topLine.children[this.iterator]);
  };
  this.update = function(optionsChanged = false) {
    // Load typing settings
    const typingModes = {};
    typingOptions.forEach(function(option) {
      const name = option.getAttribute('name');
      typingModes[name] = localStorage.getItem(name) === 'true';
      option.checked = typingModes[name];
    });
    // Get settings
    const words = new Word();
    if (this.botText === '' || optionsChanged) {
      this.botText = words.generate(16, typingModes).join(' ');
    }
    this.topText = this.botText;
    this.botText = words.generate(16, typingModes).join(' ');
    this.iterator = 0;
    // Fit words into 2 lines
    this.calibrate();
    this.render();
  };
  // Display the wordbox
  this.render = function() {
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
  };
  // Fit words into lines
  this.calibrate = function() {
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
  };
}

// -------------------------------------
// WordInput model
// -------------------------------------

function WordInput(document) {
  this.document = document;

  this.peek = function() {
    return this.document.value.trim();
  };
  this.pop = function() {
    const text = this.document.value.trim();
    this.document.value = '';
    return text;
  };
  this.hasNewWord = function() {
    if (this.document.value.includes(' ')) {
      // Prevent space spam
      if (this.document.value.trim() !== '') {
        return true;
      }
      this.document.value = '';
    }
    return false;
  };
  this.listen = function(callback) {
    this.document.addEventListener('input', callback);
  };
}

// -------------------------------------
// Timer model
// -------------------------------------

function Timer(document, duration, callback) {
  this.duration = duration;
  this.document = document;
  this.callback = callback;
  this.started = false;

  this.start = function() {
    if (this.started) {
      return;
    }
    this.started = true;
    const thisTimer = this;
    const countdown = setInterval(function() {
      if (thisTimer.duration === 0) {
        clearInterval(countdown);
        callback();
      } else {
        thisTimer.duration -= 1;
        thisTimer.update();
      }
    }, 1000);
  };
  this.update = function() {
    const min = parseInt(this.duration / 60, 10);
    const sec = this.duration % 60;
    this.document.innerHTML = `${min}:${sec}`;
  };
}
