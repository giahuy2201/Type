let randomWords = require('random-words');
import 'bootstrap';

// -------------------------------------
// Setup
// -------------------------------------

let rightWords = 0
let timer = new Timer(document.querySelector('#timer'), 60, displayWPM);
let wordInput = new WordInput(document.querySelector('.word-input'));
let wordBox = new WordBox(document.querySelector('.top'),document.querySelector('.bot'));
wordBox.update();
wordInput.listen(keystroke);

// -------------------------------------
// Input listener
// -------------------------------------

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
// WordInput
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
// Timer
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