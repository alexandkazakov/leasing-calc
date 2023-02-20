import 'babel-polyfill';

import '../index.html';
import '../style/main.scss';

const inputs = document.querySelectorAll('.form__input');
const ranges = document.querySelectorAll('.form__range');

for (let i = 0; i < inputs.length; ++i) {
  function setRange(value) {
    const formatValue = new Intl.NumberFormat('ru-RU').format(value)
    inputs[i].value = formatValue;
    ranges[i].value = value;
    inputs[i].textContent = value;
  }

  ranges[i].addEventListener('input', () => setRange(ranges[i].value));
  inputs[i].addEventListener('change', () => setRange(inputs[i].value));
}

ranges.forEach( range => {
  range.style.setProperty('--value', range.value);
  range.style.setProperty('--min', range.min == '' ? '0' : range.min);
  range.style.setProperty('--max', range.max == '' ? '100' : range.max);
  range.addEventListener('input', () => range.style.setProperty('--value', range.value));
})
