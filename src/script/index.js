import 'babel-polyfill';

import '../index.html';
import '../style/main.scss';

function calcInit(elemOptions, elemInput, elemRange) {
  elemInput.setAttribute('value', formatValue(elemOptions.value).formatedNumberValue);
  for (let key in elemOptions) {
    elemRange.setAttribute(key, elemOptions[key]);
  };
}

function syncInputWithRange(input, range) {
  // устанавливаем правильные значения в input и range
  function setRange(value) {
    value = formatValue(value).numberValue;
    const formatedValue = formatValue(value).formatedNumberValue;

    input.value = formatedValue;
    range.value = value;
  }

  range.addEventListener('input', () => setRange(range.value));
  input.addEventListener('input', () => {
    setRange(input.value);
    updateRange(range);

    // синхронизируем устанавливаемые значения под минимум и максимум
    if (+formatValue(input.value).numberValue < range.getAttribute('min')) {
      input.value = formatValue(range.getAttribute('min')).formatedNumberValue;
    } else if (+formatValue(input.value).numberValue > range.getAttribute('max')) {
      input.value = formatValue(range.getAttribute('max')).formatedNumberValue;
    }
  });
}

// форматируем значения и возвращаем
function formatValue(value) {
  const numberValue = value.toString().replace(/\s*/g, '');
  const formatedNumberValue = new Intl.NumberFormat('ru-RU').format(value);

  return {
    numberValue, // число, переведенное в тип number без пробелов
    formatedNumberValue // число типа string с пробелами
  }
}

// синхронизируем положение ползунка и положение линии прогресса
function updateRange(range) {
  range.style.setProperty('--value', range.value);
  range.style.setProperty('--min', range.min == '' ? '0' : range.min);
  range.style.setProperty('--max', range.max == '' ? '100' : range.max);
  range.addEventListener('input', () => range.style.setProperty('--value', range.value));
}

function updateFeeValues(feeOptions, costInputValue, feeInput, feeRange) {
  // устанавливаем новые значения: min, max, value у второго поля
  feeOptions.min = (costInputValue.replace(/\s*/g, '') * 0.1);
  feeOptions.max = (costInputValue.replace(/\s*/g, '') * 0.6);
  feeOptions.value = (costInputValue.replace(/\s*/g, '') * 0.13);

  calcInit(feeOptions, feeInput, feeRange); // обновляем значения feeInput и feeRange
  updateRange(feeRange); // синхронищируем линию прогресса
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.form__input');
  const ranges = document.querySelectorAll('.form__range');

  const options = [];

  options.push({
    min: 1500000,
    max: 10000000,
    value: 3300000,
    step: 100000,
  });

  options.push({
    min: (options[0]['value'] * 0.1),
    max: (options[0]['value'] * 0.6),
    value: (options[0]['value'] * 0.13),
    step: 10000,
  });

  options.push({
    min: 6,
    max: 120,
    value: 60,
    step: 1,
  });

  for (let i = 0; i < inputs.length; ++i) {
    calcInit(options[i], inputs[i], ranges[i]); // инициализируем калькулятор для каждого input
    syncInputWithRange(inputs[i], ranges[i]); // синхронизируем каждый input[text] со своим input[range]
  };

  // обновляем значения initial-fee относительно новых значений cost
  ranges[0].addEventListener('change', () => updateFeeValues(options[1], inputs[0].value, inputs[1], ranges[1]));

  ranges.forEach(range => updateRange(range)); // синхронизируем линию прогресса ползунка с ползунком
})
