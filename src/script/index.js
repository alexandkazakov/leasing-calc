import 'babel-polyfill';

import '../index.html';
import '../style/main.scss';

const inputs = document.querySelectorAll('.form__input');
const ranges = document.querySelectorAll('.form__range');

for (let i = 0; i < inputs.length; ++i) {

  function formatValue(value) {
    let numberValue = value.replace(/\s*/g, '');
    let formatedNumberValue = new Intl.NumberFormat('ru-RU').format(value);

    return {
      numberValue,
      formatedNumberValue
    }
  }

  function setRange(value) {
    value = formatValue(value).numberValue;
    let formatedValue = formatValue(value).formatedNumberValue;

    inputs[i].value = formatedValue;
    ranges[i].value = value;
    inputs[i].textContent = value;
  }

  ranges[i].addEventListener('input', () => setRange(ranges[i].value));
  inputs[i].addEventListener('input', () => {
    setRange(inputs[i].value);
    ranges[i].style.setProperty('--value', ranges[i].value);

    if (+formatValue(inputs[i].value).numberValue < ranges[i].getAttribute('min')) {
      inputs[i].value = formatValue(ranges[i].getAttribute('min')).formatedNumberValue;
    } else if (+formatValue(inputs[i].value).numberValue > ranges[i].getAttribute('max')) {
      inputs[i].value = formatValue(ranges[i].getAttribute('max')).formatedNumberValue;
    }
  });
}

ranges.forEach( range => {
  range.style.setProperty('--value', range.value);
  range.style.setProperty('--min', range.min == '' ? '0' : range.min);
  range.style.setProperty('--max', range.max == '' ? '100' : range.max);
  range.addEventListener('input', () => range.style.setProperty('--value', range.value));
});
