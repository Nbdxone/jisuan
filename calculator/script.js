let currentInput = '0';
let previousInput = '';
let operation = null;

const display = document.getElementById('display');

function updateDisplay() {
  display.textContent = currentInput || '0';
}

function appendNumber(number) {
  if (currentInput === '0' && number !== '.') {
    currentInput = number;
  } else if (number === '.' && currentInput.includes('.')) {
    return;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentInput === '' && op === '-') {
    currentInput = '-';
    updateDisplay();
    return;
  } else if (currentInput === '' || currentInput === '-') {
    return;
  }

  if (operation !== null) calculate();

  previousInput = currentInput;
  operation = op;
  currentInput = '';

  updateDisplay();
}

function calculate() {
  let computation;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '/':
      computation = prev / current;
      break;
    default:
      return;
  }

  currentInput = computation.toString();
  operation = null;
  previousInput = '';

  updateDisplay();
}

function clearDisplay() {
  currentInput = '0';
  previousInput = '';
  operation = null;

  updateDisplay();
}

function backspace() {
  if (currentInput.length === 1) {
    clearDisplay();
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '-') currentInput = '';
    if (currentInput === '') currentInput = '0';
    if (currentInput.endsWith('.00')) currentInput = currentInput.slice(0, -2);
    if (!isNaN(+currentInput)) currentInput = (+currentInput).toString();
  }

  updateDisplay();
}

// Initialize display
updateDisplay();

// Keyboard support
document.addEventListener('keydown', function (event) {
  if (event.key >= '0' && event.key <= '9') {
    appendNumber(event.key);
  } else
    switch (event.key) {
      case '.':
        appendNumber('.');
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        appendOperator(event.key);
        break;

      case 'Enter':
        calculate();
        break;

      case 'Escape':
        clearDisplay();
        break;

      case 'Backspace':
        backspace();
        break;

      default:
        return;
    }

  event.preventDefault();
});

// Prevent form submission when pressing Enter outside the calculator
window.addEventListener(
  'keydown',
  function (e) {
    if (
      (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) &&
      e.target.nodeName == 'INPUT' &&
      e.target.type != 'textarea'
    ) {
      e.preventDefault();
      return false;
    }
  },
  true
);

// Make calculator draggable - optional feature!
let isDragging = false,
  offsetX,
  offsetY;

const calcEl = document.querySelector('.calculator');

calcEl.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - calcEl.getBoundingClientRect().left;
  offsetY = e.clientY - calcEl.getBoundingClientRect().top;

  calcEl.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  calcEl.style.left = `${e.clientX - offsetX}px`;
  calcEl.style.top = `${e.clientY - offsetY}px`;
  calcEl.style.position = 'absolute';
  calcEl.style.margin = 'auto';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  calcEl.style.cursor = 'grab';
});

// Initial position adjustment for draggable calculator - center it by default.
window.onload = function () {
  const calcRect = calcEl.getBoundingClientRect(),
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

  calcEl.style.left = `${(windowWidth - calcRect.width) / 2}px`;
  calcEl.style.top = `${(windowHeight - calcRect.height) / 2}px`;
  calcEl.style.position = 'absolute';

  setTimeout(() => {
    calcEl.style.transition = 'all 0.3s ease-out';
  }, 100);
};