/**
 * Typing machine
 * by giahuy2201 (giahuy2201@outlook.com)
 */

let randomWords = require('random-words');
import 'bootstrap';

// -------------------------------------
// Setup
// -------------------------------------

let rightWords = 0
let timer = new Timer(document.querySelector('#timer'), 60, displayWPM);
let wordInput = new WordInput(document.querySelector('.word-input'));
let wordBox = new WordBox(document.querySelector('.top'), document.querySelector('.bot'));
let body = document.querySelector('body');
let darkModeCheck = document.querySelector('#dark-switch > input');
let darkAutoCheck = document.querySelector('.auto');
let darkSwitch = document.querySelector('.dark-switch');
let themes = document.querySelectorAll('.theme__item');
let selectedTheme;
wordBox.update();
updateAppearance();
wordInput.listen(keystroke);

// -------------------------------------
// Dark mode auto activate
// -------------------------------------
// Dark - light switch
darkModeCheck.addEventListener('change', function () {
    localStorage.setItem('darkMode', darkModeCheck.checked);
    updateAppearance()
})
// Auto checkbox
darkAutoCheck.addEventListener('change', function () {
    localStorage.setItem('darkAuto', darkAutoCheck.checked);
    updateAppearance()
})

// -------------------------------------
// Local saved data from localStorage
// -------------------------------------

function updateAppearance() {
    let darkAuto = localStorage.getItem('darkAuto');
    let darkMode = localStorage.getItem('darkMode');
    let themeIndex = localStorage.getItem('theme') || 0;
    // dark auto
    if (darkAuto == 'true') {
        darkAutoCheck.checked = true;
        body.setAttribute('id', 'dark-auto');
        disable(darkSwitch);
    } else {
        darkAutoCheck.checked = false;
        body.removeAttribute('id');
        enable(darkSwitch);
        body.classList.remove('dark-mode');
        if (darkMode == 'true') {
            body.classList.add('dark-mode');
        }
    }
    // dark switch
    if (darkMode == 'true') {
        darkModeCheck.checked = true;
    } else {
        darkModeCheck.checked = false;
    }
    // theme
    themes.forEach(function (element) {
        element.classList.remove('theme-selected');
    })
    let url = '';
    if (themeIndex != 0) {
        selectedTheme = themes[themeIndex - 1]
        selectedTheme.classList.add('theme-selected');
        url = getComputedStyle(selectedTheme, false).backgroundImage;
    }
    body.style.backgroundImage = url;
    body.style.backgroundSize = '200px';
}
function disable(document) {
    document.style.setProperty('filter', 'grayscale(100%)');
    document.children[0].disabled = true;
}
function enable(document) {
    document.style.removeProperty('filter');
    document.children[0].disabled = false;
}

// -------------------------------------
// Theme select
// -------------------------------------

themes.forEach(function (theme, index) {
    theme.addEventListener('click', function () {
        if (this.classList.contains('theme-selected')) {
            localStorage.setItem('theme', '');
        }else{
            localStorage.setItem('theme', index+1); 
        }
        updateAppearance();
    })
});

function activateTheme(url) {
    if (url) {
        body.style.backgroundImage = url;
        body.style.backgroundSize = '200px';
    } else {
        body.style.backgroundImage = '';
    }
}

// -------------------------------------
// Input listener
// -------------------------------------

let panel = document.querySelector('#panel');
panel.addEventListener('mouseleave', function () {
    panel.style.setProperty('display', 'none');
})
let more = document.querySelector('#more');
more.addEventListener('mouseover', function () {
    panel.style.setProperty('display', 'block');
})

function keystroke() {
    // Start timer
    timer.start()
    // Check input
    let word = wordBox.get();
    if (wordInput.hasNewWord()) {
        // Compare the words
        if (wordInput.pop() == word.text()) {
            word.addClass('right')
            rightWords++;
        } else {
            word.removeClass('mistake')
            word.addClass('wrong')
        }
        // highlight the next word instead
        word.removeClass('highlight');
        wordBox.next().addClass('highlight');

    } else {
        // check if input is part of the sample word
        if (word.text().indexOf(wordInput.peek()) == 0) {
            word.removeClass('mistake')
        } else {
            word.addClass('mistake')
        }
        // mark it
        word.addClass('highlight')
    }
}

function displayWPM() {
    let wpm = document.querySelector('#point')
    wpm.innerHTML = rightWords + ' wpm'
    // Save the best result
    let best = localStorage.getItem('best') || 0;
    if (rightWords > best) {
        best = rightWords;
        localStorage.setItem('best', best)
    }
    wpm.setAttribute('title', 'Best is ' + best)
}

// -------------------------------------
// Word model
// -------------------------------------

function Word(document) {
    this.document = document;

    this.text = function () {
        return this.document.innerHTML;
    }
    this.addClass = function (className) {
        this.document.classList.remove(className);
        this.document.classList.add(className);
    }
    this.removeClass = function (className) {
        this.document.classList.remove(className);
    }
}

// -------------------------------------
// WordBox model
// -------------------------------------

function WordBox(topDocument, botDocument) {
    this.topLine = topDocument;
    this.botLine = botDocument;
    this.topText = '';
    this.botText = '';
    this.iterator = 0;

    // Get current word
    this.get = function () {
        return new Word(this.topLine.children[this.iterator])
    }
    // Get the next word
    this.next = function () {
        this.iterator++;
        // No more word -> update
        if (this.topLine.childElementCount < this.iterator + 1) {
            this.update();
        }
        return new Word(this.topLine.children[this.iterator])
    }
    this.update = function () {
        if (this.botText == '') {
            this.botText = randomWords(10).join(' ')
        }
        this.topText = this.botText;
        this.botText = randomWords(10).join(' ')
        this.iterator = 0;
        // Fit words into 2 lines
        this.calibrate();
        this.render();
    }
    // Display the wordbox
    this.render = function () {
        // Construct the top line
        let topList = this.topText.split(' ');
        let formatedTopList = [];
        topList.forEach(word => {
            formatedTopList.push('<span class="word">' + word + '</span>')
        });
        this.topLine.innerHTML = formatedTopList.join(' ')
        // Construct the bottom line
        let botList = this.botText.split(' ');
        let formatedBotList = [];
        botList.forEach(word => {
            formatedBotList.push('<span class="word">' + word + '</span>')
        });
        this.botLine.innerHTML = formatedBotList.join(' ')
    }
    // Fit words into lines
    this.calibrate = function () {
        // Display to get the overflow attribute - offsetTop
        this.render();
        // check top line
        let topWords = this.topLine.children;
        let originWord = topWords[0]
        for (let i = 0; i < topWords.length; i++) {
            const word = topWords[i];
            // find the breakpoint
            if (word.offsetTop > originWord.offsetTop) {
                let list = this.topText.split(' ')
                this.topText = list.splice(0, i).join(' ')
                this.botText = list.join(' ') + ' ' + this.botText
                break
            }
        }
        // update to get the real change
        this.render();
        // check bottom line
        let botWords = this.botLine.children;
        originWord = botWords[0]
        for (let i = 0; i < botWords.length; i++) {
            const word = botWords[i];
            if (word.offsetTop > originWord.offsetTop) {
                let list = this.botText.split(' ')
                this.botText = list.splice(0, i).join(' ')
                break
            }
        }
    }
}

// -------------------------------------
// WordInput model
// -------------------------------------

function WordInput(document) {
    this.document = document;

    this.peek = function () {
        return this.document.value.trim();
    }
    this.pop = function () {
        let text = this.document.value.trim();
        this.document.value = ''
        return text
    }
    this.hasNewWord = function () {
        if (this.document.value.includes(' ')) {
            // Prevent space spam
            if (this.document.value.trim() != '') {
                return true;
            }
            this.document.value = '';
        }
        return false;
    }
    this.listen = function (callback) {
        this.document.addEventListener('input', callback);
    }
}

// -------------------------------------
// Timer model
// -------------------------------------

function Timer(document, duration, callback) {
    this.duration = duration;
    this.document = document;
    this.callback = callback;
    this.started = false;

    this.start = function () {
        if (this.started) {
            return
        }
        this.started = true;
        let timer = this;
        let countdown = setInterval(function () {
            if (timer.duration == 0) {
                clearInterval(countdown);
                callback();
            } else {
                timer.duration--;
                timer.update();
            }
        }, 1000);
    }
    this.update = function () {
        let min = parseInt(this.duration / 60);
        let sec = this.duration % 60;
        this.document.innerHTML = min + ':' + sec;
    }
}