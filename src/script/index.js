import 'babel-polyfill';

import '../index.html';
import '../style/main.scss';

// инициализируем поле калькулятора
function calcInit(elemOptions, elemInput, elemRange) {
  elemInput.setAttribute('value', formatValue(elemOptions.value).formatedNumberValue);
  for (let key in elemOptions) {
    elemRange.setAttribute(key, elemOptions[key]);
  };
  // обновляем значения полей
  elemInput.value = formatValue(elemOptions.value).formatedNumberValue;
  elemRange.value = elemOptions.value;
}

// синхронизируем значение input[text] и input[range]
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

// обновляем значение initial-fee относительно новых значений cost
function updateFeeValues(feeOptions, costInputValue, feeInput, feeRange, termInputValue) {
  // устанавливаем новые значения: min, max, value у второго поля
  feeOptions.min = (costInputValue.replace(/\s*/g, '') * 0.1);
  feeOptions.max = (costInputValue.replace(/\s*/g, '') * 0.6);
  feeOptions.value = (costInputValue.replace(/\s*/g, '') * 0.13);

  calcInit(feeOptions, feeInput, feeRange); // обновляем значения feeInput и feeRange
  updateRange(feeRange); // синхронищируем линию прогресса
  updateRate(costInputValue, feeInput.value); // обновляем ставку
  updateResults(costInputValue, feeInput.value, termInputValue); // обновляем результаты относительно новых значений
}

function updateRate(costValue, feeValue) {
  const rateElem = document.querySelector('.form__input_help-fee');
  rateElem.textContent = Math.floor(formatValue(feeValue).numberValue / formatValue(costValue).numberValue * 100) + '%';
}

function updateResults(costValue, feeValue, termValue) {
  const sumElem = document.querySelector('.form__result_sum');
  const paymentElem = document.querySelector('.form__result_payment');

  costValue = formatValue(costValue).numberValue;
  feeValue = formatValue(feeValue).numberValue;
  termValue = formatValue(termValue).numberValue;

  const paymentValue = Math.round((costValue - feeValue) * (0.05 * Math.pow((1 + 0.05), termValue) / (Math.pow((1 + 0.05), termValue) - 1)));
  const sumValue = Math.round(+feeValue + (paymentValue * +termValue));

  paymentElem.textContent = formatValue(paymentValue).formatedNumberValue + ' ₽';
  sumElem.textContent = formatValue(sumValue).formatedNumberValue + ' ₽';

  return {
    paymentValue,
    sumValue
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.form__input');
  const ranges = document.querySelectorAll('.form__range');
  const form = document.querySelector('.form');
  const formInputHelps = document.querySelectorAll('.form__input_help');
  const formSubmitBtn = document.querySelector('.form__submit');

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
    updateResults(inputs[0].value, inputs[1].value, inputs[2].value); // обновляем значения результатов до актуальных

    ranges[i].addEventListener('input', () => updateResults(inputs[0].value, inputs[1].value, inputs[2].value)); // следим за обновлением результатов по изменению range
    inputs[i].addEventListener('input', () => updateResults(inputs[0].value, inputs[1].value, inputs[2].value)); // следим за обновлением результатов по изменению input
  };

  // обновляем значения initial-fee относительно новых значений cost
  ranges[0].addEventListener('input', () => updateFeeValues(options[1], inputs[0].value, inputs[1], ranges[1], inputs[2].value));
  inputs[0].addEventListener('input', () => updateFeeValues(options[1], inputs[0].value, inputs[1], ranges[1], inputs[2].value));

  ranges[1].addEventListener('input', () => updateRate(inputs[0].value, inputs[1].value)); // обновляем ставку относительно новых значений
  ranges.forEach(range => updateRange(range)); // синхронизируем линию прогресса ползунка с ползунком

  form.addEventListener('submit', event => {
    event.preventDefault();

    // деактивируем форму
    inputs.forEach(input => {
      input.setAttribute('disabled', true);
    });
    ranges.forEach(range => {
      range.setAttribute('disabled', true);
    });
    formInputHelps.forEach(elem => {
      elem.classList.add('disabled');
    });
    formSubmitBtn.setAttribute('disabled', true);

    // формируем результат
    const result = {
      cost: formatValue(inputs[0].value).numberValue,
      fee: formatValue(inputs[1].value).numberValue,
      term: formatValue(inputs[2].value).numberValue,
      sum: updateResults(inputs[0].value, inputs[1].value, inputs[2].value).sumValue,
      payment: updateResults(inputs[0].value, inputs[1].value, inputs[2].value).paymentValue
    };

    // выводим его на экран в виде JSON
    setTimeout(() => {
      alert( JSON.stringify(result) );
    }, 100);
  })
})
