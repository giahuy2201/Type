var randomWords = require('random-words')

sample = document.querySelector('.word-box')
data = 'To read a short passage about people in English and feel comfortable you need to know your English level in reading skills'
dataCursor = 0
point = 0
position = 0
started = false
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
function runOutWord() {
    return position >= 18
}
function updatePassage() {
    let list = data.split(' ')
    passage = list.splice(dataCursor, 18).join(' ')
    dataCursor += 18
    position = 0
    updateSample()
}
function referWord(position) {
    return document.querySelector('.word-box > span:nth-child(' + (position + 1) + ')')
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
function popSample(position) {
    let list = passage.split(' ')
    let word = list.splice(position, 1)
    passage = list.reverse().join(' ')
    return word
}
function peekSample(position) {
    let list = passage.split(' ')
    return list[position]
}
function updateSample() {
    let list = passage.split(' ')
    let formatedList = []
    list.forEach(word => {
        formatedList.push('<span>' + word + '</span>')
    });
    sample.innerHTML = formatedList.join(' ')
}
function updatePoint() {
    var p = document.querySelector('#point')
    p.innerHTML = point
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
        } else {
            minutes -= 1
            updateTimer(minutes)
        }
    }, 1000)
}
function calculateWPM() {
    updatePoint()
}