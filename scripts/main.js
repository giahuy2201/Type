/**
 * Typing machine
 * by giahuy2201 (giahuy2201@outlook.com)
 */

import 'bootstrap';
import '../styles/style.scss';
import Settings from './Setting';
import WordBox from './WordBox';
import WordInput from './WordInput';
import Timer from './Timer';
import WPM from './WPM';

// Mobile prevent
mobileWarning(document.querySelector('body'));

// -------------------------------------
// Setup variables
// -------------------------------------
const wpm = new WPM(document.querySelector('#point'));
const timer = new Timer(
  document.querySelector('#timer'),
  document.querySelector('body'),
  wpm
);
const wordBox = new WordBox(
  document.querySelector('.top'),
  document.querySelector('.bot'),
  document.querySelectorAll('.typing-option input')
);
const wordInput = new WordInput(
  document.querySelector('.word-input'),
  wordBox,
  timer,
  wpm
);
const settings = new Settings(
  document.querySelector('body'),
  document.querySelector('#panel'),
  document.querySelector('#more'),
  document.querySelectorAll('.typing-option input'),
  document.querySelectorAll('.dark-option input'),
  document.querySelectorAll('.theme-option'),
  wordBox
);
settings.updateAppearance();
settings.updateTheme();
settings.updateWordBox();
settings.listen();
wordInput.listen();
timer.listen();

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

// Checkout my page
document.querySelector('#coder').addEventListener('click', () => {
  window.location.href = 'https://giahuy2201.github.io';
});
