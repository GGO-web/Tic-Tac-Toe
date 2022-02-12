class Move {
  constructor(state = 'red') {
    this.state = state;
    this.count = 0;
  }

  next() {
    if (this.isRed()) {
      this.state = 'blue';
    } else if (this.isBlue()) {
      this.state = 'red';
    }
  }

  isRed() {
    return this.state === 'red';
  }

  isBlue() {
    return this.state === 'blue';
  }
}

class Game {
  constructor(state = 'red') {
    this.rows = 3;
    this.cols = 3;
    this.move = new Move(state);

    this.init();
  }

  init() {
    this.build();
    this.underline();
    this.triggers();
  }

  build() {
    const game = document.querySelector('.game');

    for (let row = 1, index = 1; row <= this.rows; ++row) {
      for (let col = 1; col <= this.cols; ++col) {
        game.insertAdjacentHTML(
          'beforeend',
          `
          <button aria-label="Tic Tac Toe cell" data-row=${row} data-col="${col}"
            data-index="${index}" class="game__cell btn-reset">
          </button>
          `
        );
        index++;
      }
    }
  }

  triggers() {
    const cells = document.querySelectorAll('.game__cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        this.fill(cell);
        this.move.count++;
        this.checkout();
        this.move.next();
        this.underline();
      });
    });

    const newGameButton = document.querySelector('.controls__new-game');
    const resetButton = document.querySelector('.controls__reset');

    newGameButton.addEventListener('click', () => {
      this.clear();
    });

    resetButton.addEventListener('click', () => {
      this.clear();
      this.reset();
    });
  }

  fill(cell) {
    if (this.move.isRed()) {
      cell.insertAdjacentHTML('beforeend', `<div class="cross"></div>`);
    } else {
      cell.insertAdjacentHTML('beforeend', `<div class="circle"></div>`);
    }
    cell.setAttribute('disabled', 'true');
  }

  checkout() {
    const winDescriptor = this.checkWin(this.move.state);
    if (winDescriptor) {
      const { direction, cell } = winDescriptor;

      const game = document.querySelector('.game');
      game.setAttribute('data-direction', direction);

      if (direction === 'horizontal') {
        const row = cell.getAttribute('data-row');
        game.style.setProperty('--value', row);
      } else if (direction === 'vertical') {
        const col = cell.getAttribute('data-col');
        game.style.setProperty('--value', col);
      }

      this.disable();
      this.addWin(this.move.state);

      // alert(`${this.move.state} is Win!`);
    } else if (this.move.count === this.rows * this.cols) {
      this.addWin(this.move.state);
      this.move.next();
      this.addWin(this.move.state);
      this.move.next();

      // alert('Draw!');
      this.clear();
    }
  }

  disable() {
    const cells = document.querySelectorAll('.game__cell');
    cells.forEach((cell) => cell.setAttribute('disabled', 'true'));
  }

  checkWin(state) {
    for (let i = 1; i <= this.cols; ++i) {
      // vertical
      for (let j = 1, ind = i; j <= this.rows; ind += this.rows, ++j) {
        const cell = document.querySelector(`.game__cell[data-index="${ind}"]`);
        const cellState = cell.querySelector(`.${state === 'red' ? 'cross' : 'circle'}`);

        if (!cellState) {
          break;
        }

        if (cellState && j === this.rows) {
          return { direction: 'vertical', cell };
        }
      }

      // horizontal
      for (let j = 1; j <= this.rows; ++j) {
        const index = Math.max(0, i - 1) * this.rows + j;
        const cell = document.querySelector(`.game__cell[data-index="${index}"]`);
        const cellState = cell.querySelector(`.${state === 'red' ? 'cross' : 'circle'}`);

        if (!cellState) {
          break;
        }

        if (cellState && j === this.rows) {
          return { direction: 'horizontal', cell };
        }
      }
    }

    // main diagonal
    for (let j = 0, ind = 1; j < this.rows; ind += this.rows + 1, ++j) {
      const cell = document.querySelector(`.game__cell[data-index="${ind}"]`);
      const cellState = cell.querySelector(`.${state === 'red' ? 'cross' : 'circle'}`);

      if (!cellState) {
        break;
      }

      if (cellState && j === this.rows - 1) {
        return { direction: 'main', cell };
      }
    }

    // lateral diagonal
    for (let j = 0, ind = this.cols; j < this.rows; ind += this.cols - 1, ++j) {
      const cell = document.querySelector(`.game__cell[data-index="${ind}"]`);
      const cellState = cell.querySelector(`.${state === 'red' ? 'cross' : 'circle'}`);

      if (!cellState) {
        break;
      }

      if (cellState && j === this.rows - 1) {
        return { direction: 'lateral', cell };
      }
    }

    return false;
  }

  clear() {
    const game = document.querySelector('.game');
    game.removeAttribute('data-direction');

    const cells = document.querySelectorAll('.game__cell');

    cells.forEach((cell) => {
      const cellState = cell.children[0];

      if (cellState) {
        cellState.classList.add('hide');
      }

      setTimeout(() => {
        cell.removeAttribute('disabled');
        cell.innerHTML = '';
      }, 500);
    });

    this.move = new Move(this.move.state);
  }

  reset() {
    const marks = document.querySelectorAll(`.versus__mark`);
    marks.forEach((mark) => mark.removeAttribute('data-wins'));
  }

  underline() {
    const names = document.querySelectorAll('.versus__name');
    names.forEach((name) => name.classList.remove('active'));

    const activeName = document.querySelector(`.versus__name[data-state="${this.move.state}"]`);
    activeName.classList.add('active');
  }

  addWin(state) {
    const winner = document.querySelector(`.versus__name[data-state="${state}"]`).previousElementSibling;
    const wins = winner.getAttribute('data-wins');

    if (wins) {
      winner.setAttribute('data-wins', +wins + 1);
    } else {
      winner.setAttribute('data-wins', 1);
    }
  }
}

const tictactoe = new Game('red');

export default tictactoe;
