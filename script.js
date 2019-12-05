var randomWords = require('random-words')

point = 0
position = 0
started = false
buffer = ''
sampleTop = document.querySelector('.word-top')
sampleBot = document.querySelector('.word-bot')
updatePassage()
input = document.querySelector('input')
input.addEventListener('input', function () {
    if (!started) {
        started = true
        countdown(60, calculateWPM)
    }
    if (input.value.includes(' ')) {
        let word = referWord(position)
        inputText = popInput()
        sampleText = word.innerHTML
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
        let nextWord = referWord(position)
        if (nextWord) {
        } else {
            // update passage
            updatePassage()
            nextWord = referWord(position)
        }
        nextWord.classList.add('highlight')
        // updatePoint()
    } else {
        let word = referWord(position)
        word.classList.remove('highlight')
        word.classList.add('highlight')
        inputText = peekInput()
        sampleText = word.innerHTML
        if (goodInput(sampleText, inputText)) {
            word.classList.remove('mistake')
        } else {
            word.classList.remove('mistake')
            word.classList.add('mistake')
        }
    }
})
function updatePassage() {
    if (buffer == '') {
        buffer = randomWords(8).join(' ')
    }
    passage = buffer
    buffer = randomWords(8).join(' ')
    position = 0
    fit2lines()
    updateSample()
}
function fit2lines() {
    updateSample()
    // check sampleTop
    let topWords = document.querySelectorAll('.word-top > span')
    var originWord = topWords[0]
    for (let i = 0; i < topWords.length; i++) {
        const word = topWords[i];
        if (word.offsetTop > originWord.offsetTop) {
            // console.log('top ' + i)
            var list = passage.split(' ')
            passage = list.splice(0, i).join(' ')
            buffer = list.join(' ') + ' ' + buffer
            break
        }
    }
    // update to get the real change
    updateSample()
    // check sampleBot
    let botWords = document.querySelectorAll('.word-bot > span')
    originWord = botWords[0]
    for (let i = 0; i < botWords.length; i++) {
        const word = botWords[i];
        if (word.offsetTop > originWord.offsetTop) {
            // console.log('bot ' + i)
            var list = buffer.split(' ')
            buffer = list.splice(0, i).join(' ')
            break
        }
    }
}
function referWord(position) {
    return document.querySelector('.word-top > span:nth-child(' + (position + 1) + ')')
}
function goodInput(sample, input) {
    return sample.indexOf(input) == 0
}
function popInput() {
    var text = input.value.trim()
    input.value = ''
    return text
}
function peekInput() {
    return input.value
}
function updateSample() {
    let listTop = passage.split(' ')
    let formatedListTop = []
    listTop.forEach(word => {
        formatedListTop.push('<span>' + word + '</span>')
    });
    sampleTop.innerHTML = formatedListTop.join(' ')
    let listBot = buffer.split(' ')
    let formatedListBot = []
    listBot.forEach(word => {
        formatedListBot.push('<span>' + word + '</span>')
    });
    sampleBot.innerHTML = formatedListBot.join(' ')
}
function updateTimer(minutes) {
    var timer = document.querySelector('#timer')
    let min = parseInt(minutes / 60)
    let sec = minutes % 60
    timer.innerHTML = min + ':' + sec
}
function countdown(minutes, done) {
    var timer = setInterval(function () {
        if (minutes == 0) {
            done()
            clearInterval(timer)
        } else {
            minutes -= 1
            updateTimer(minutes)
        }
    }, 1000)
}
function calculateWPM() {
    var p = document.querySelector('#point')
    p.innerHTML = point+' wpm'
}