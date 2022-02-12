import TypeIt from 'typeit';

function lock() {
  const body = document.body;
  body.style.setProperty('overflow', 'hidden');
}

function unlock() {
  const body = document.body;
  body.style.removeProperty('overflow');
}

function hideForm() {
  const gameStart = document.querySelector('.game-start');
  gameStart.classList.add('fade-out');
}

function typeNames() {
  const inputs = document.querySelectorAll('.game-start__input');
  const names = document.querySelectorAll('.versus__name');

  names.forEach((name, index) => {
    new TypeIt(name, {
      speed: 150,
      startDelay: 800 * (index + 1),
      afterComplete: function (instance) {
        instance.destroy();
      }
    })
      .type(inputs[index].value)
      .go();
  });
}

function formSubmit() {
  const form = document.querySelector('.form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll('.game-start__input');
    let errors = 0;
    inputs.forEach((input) => {
      const value = input.value;

      if (!/[^\s\d]/g.test(value)) {
        errors++;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (!errors) {
      hideForm();
      unlock();
      typeNames();
    }
  });
}

(() => {
  lock();
  formSubmit();
})();
