// -------------------------------------
// Settings model
// -------------------------------------

export default class Settings {
  constructor(
    page,
    panel,
    more,
    typingOptions,
    darkOptions,
    themeOptions,
    wordBox
  ) {
    this.page = page;
    this.panel = panel;
    this.more = more;
    this.wordBox = wordBox;
    this.typingOptions = typingOptions;
    this.darkOptions = darkOptions;
    this.themeOptions = themeOptions;
    this.selectedTheme = null;
  }

  // Get data from localStorage and show on option panel
  updateAppearance() {
    const darkAuto = localStorage.getItem('darkAuto') === 'true';
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkAutoCheck = this.darkOptions[1];
    const darkModeCheck = this.darkOptions[0];
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
  }

  updateTheme() {
    const themeIndex = localStorage.getItem('theme') || 0;
    this.themeOptions.forEach(option => {
      option.classList.remove('theme-selected');
    });
    let url = '';
    this.selectedTheme = this.themeOptions[themeIndex - 1];
    if (this.selectedTheme) {
      this.selectedTheme.classList.add('theme-selected');
      url = getComputedStyle(this.selectedTheme, false).backgroundImage;
    }
    this.page.style.backgroundImage = url;
    this.page.style.backgroundSize = '200px';
  }

  updateWordBox() {
    this.wordBox.update(true);
  }

  // add listeners to add settings
  listen() {
    // Setup setting panel
    this.panel.addEventListener('mouseleave', () => {
      this.panel.style.setProperty('display', 'none');
    });
    this.more.addEventListener('mouseover', () => {
      this.panel.style.setProperty('display', 'block');
    });

    // typing options
    this.typingOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Grab all checkbox info and save
        this.typingOptions.forEach(opt => {
          const name = opt.getAttribute('name');
          localStorage.setItem(name, opt.checked);
        });
        this.updateWordBox();
      });
    });
    // dark options
    this.darkOptions.forEach(option => {
      option.addEventListener('click', () => {
        const name = option.getAttribute('name');
        localStorage.setItem(name, option.checked);
        this.updateAppearance();
      });
    });
    // theme options
    this.themeOptions.forEach((option, index) => {
      option.addEventListener('click', () => {
        if (option.classList.contains('theme-selected')) {
          localStorage.setItem('theme', '');
        } else {
          localStorage.setItem('theme', index + 1);
        }
        this.updateTheme();
      });
    });
    // Key shortcuts for typing modes
    this.page.addEventListener('keydown', event => {
      if (
        (event.key === 'e' || event.key === 'r') &&
        event.ctrlKey &&
        event.metaKey
      ) {
        let primaryModeIndex = 1;
        let secondaryModeIndex = 2;
        if (event.key === 'r') {
          primaryModeIndex = 2;
          secondaryModeIndex = 1;
        }
        const secondaryMode = this.typingOptions[secondaryModeIndex];
        secondaryMode.checked = false;
        const secondaryModeName = secondaryMode.getAttribute('name');
        localStorage.setItem(secondaryModeName, 'false');
        const primaryMode = this.typingOptions[primaryModeIndex];
        primaryMode.checked = !primaryMode.checked;
        const primaryModeName = primaryMode.getAttribute('name');
        localStorage.setItem(primaryModeName, primaryMode.checked);
        this.updateWordBox();
      }
    });
  }
}
