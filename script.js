let randomWords = require('random-words');
import 'bootstrap';
import 'jquery';
import _ from 'lodash';

// -------------------------------------
// Setup
// -------------------------------------

let point = 0
let position = 0
let started = false
let passage = ''
let buffer = ''
let sampleTop = document.querySelector('.top')
let sampleBot = document.querySelector('.bot')
updatePassage()
let input = document.querySelector('.word-input')
input.addEventListener('input', function () {
    // document.querySelector('.heading').innerHTML+='*'

    if (!started) {
        started = true
        countdown(60, calculateWPM)
    }
    if (input.value.includes(' ')) {
        let word = getWord(position)
        let inputText = popInput()
        let sampleText = word.innerHTML
        if (inputText == sampleText) {
            word.classList.add('right')
            point += 1
        } else {
            // prevent space spam
            if (inputText == '') {
                return
            } else {
                word.classList.remove('mistake')
                word.classList.add('wrong')
            }
        }
        // highlight the next word instead
        word.classList.remove('highlight')
        position += 1
        let nextWord = getWord(position)
        if (!nextWord) {
            // update passage
            updatePassage()
            nextWord = getWord(position)
        }
        nextWord.classList.add('highlight')
        // updatePoint()
    } else {
        let word = getWord(position)
        word.classList.remove('highlight')
        word.classList.add('highlight')
        let inputText = peekInput()
        let sampleText = word.innerHTML
        if (goodInput(sampleText, inputText)) {
            word.classList.remove('mistake')
        } else {
            word.classList.remove('mistake')
            word.classList.add('mistake')
        }
    }
})

// -------------------------------------
// Functional
// -------------------------------------

function getWord(position) {
    return document.querySelector('.top > .word:nth-child(' + (position + 1) + ')');
}
function goodInput(sample, input) {
    return sample.indexOf(input) == 0
}
function popInput() {
    let text = input.value.trim()
    input.value = ''
    return text
}
function peekInput() {
    return input.value
}

function countdown(seconds, done) {
    let timer = setInterval(function () {
        if (seconds == 0) {
            clearInterval(timer)
            done()
        } else {
            seconds--;
            updateTimer(seconds);
        }
    }, 1000);
}


function calculateWPM() {
    let p = document.querySelector('#point')
    p.innerHTML = point + ' wpm'
}

// -------------------------------------
// Update UI
// -------------------------------------

function updatePassage() {
    if (buffer == '') {
        buffer = randomWords(10).join(' ')
    }
    passage = buffer
    buffer = randomWords(10).join(' ')
    position = 0
    fit2lines()
    updateSample()
}

function fit2lines() {
    updateSample()
    // check sampleTop
    let topWords = document.querySelectorAll('.top > .word')
    let originWord = topWords[0]
    for (let i = 0; i < topWords.length; i++) {
        const word = topWords[i];
        if (word.offsetTop > originWord.offsetTop) {
            // console.log('top ' + i)
            let list = passage.split(' ')
            passage = list.splice(0, i).join(' ')
            buffer = list.join(' ') + ' ' + buffer
            break
        }
    }
    // update to get the real change
    updateSample()
    // check sampleBot
    let botWords = document.querySelectorAll('.bot > .word')
    originWord = botWords[0]
    for (let i = 0; i < botWords.length; i++) {
        const word = botWords[i];
        if (word.offsetTop > originWord.offsetTop) {
            // console.log('bot ' + i)
            let list = buffer.split(' ')
            buffer = list.splice(0, i).join(' ')
            break
        }
    }
}
function updateSample() {
    let listTop = passage.split(' ')
    let formatedListTop = []
    listTop.forEach(word => {
        formatedListTop.push('<span class="word">' + word + '</span>')
    });
    sampleTop.innerHTML = formatedListTop.join(' ')
    let listBot = buffer.split(' ')
    let formatedListBot = []
    listBot.forEach(word => {
        formatedListBot.push('<span class="word">' + word + '</span>')
    });
    sampleBot.innerHTML = formatedListBot.join(' ');
}
function updateTimer(seconds) {
    let timer = document.querySelector('#timer');
    let min = parseInt(seconds / 60);
    let sec = seconds % 60;
    timer.innerHTML = min + ':' + sec;
}