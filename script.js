'use strict';

const form = document.querySelector('.stock-form');
const datePicker = document.getElementById('date-picker');
const numStocksEl = document.getElementById('num-stocks');

const outputTable = document.querySelector('.output-table');
const apiError = document.querySelector('.output-api-error');
const buyValueEl = document.querySelector('.buy-value');
const sellValueEl = document.querySelector('.sell-value');
const PLEl = document.querySelector('.profit-or-loss');
const PLValue = document.querySelector('.profit-or-loss-value');
const percEl = document.querySelector('.percentage');
const percValue = document.querySelector('.percentage-value');

const key = '3836e64d9024018914f686e50934041a';

function displayInputErorr(flag) {
  const errorHTML =
    '<p class="error-message">Number should be greater than 0</p>';
  if (flag) {
    numStocksEl.insertAdjacentHTML('afterend', errorHTML);
    numStocksEl.classList.add('error');
  } else {
    const errorEls = [...document.querySelectorAll('.error-message')];
    errorEls.forEach((el) => el.remove());
    numStocksEl.classList.remove('error');
  }
}

function displayAPIError(code) {
  apiError.classList.remove('hidden');
  if (code === 0) apiError.innerText = 'No data available for given ticker';

  if (code === 1)
    apiError.innerText =
      'No data available for given buy date. Check if markets were open then.';
}

async function fetchData(ticker, exchange, date) {
  const fetchURL = `https://abinjohn-pl-calculator.netlify.app/api/${date}?access_key=${key}&symbols=${ticker}.${exchange}`;

  const urlData = await fetch(fetchURL);

  if (urlData.status === 422) {
    displayAPIError(0);
    return false;
  }

  const json = await urlData.json();

  if (json.data.length === 0) {
    displayAPIError(1);
    return false;
  }
  console.log(json);
  return Math.round(json.data[0].close);
}

function setOutputColor(stat) {
  if (stat) {
    outputTable.classList.remove('loss');
    outputTable.classList.add('profit');
  } else {
    outputTable.classList.remove('profit');
    outputTable.classList.add('loss');
  }
}

function outputDetails(buyPrice, sellPrice, numStocks) {
  const currency = '₹';

  buyValueEl.innerText = currency + buyPrice;
  sellValueEl.innerText = currency + sellPrice;

  const profitStat = sellPrice > buyPrice ? 'Profit' : 'Loss';
  setOutputColor(sellPrice > buyPrice);

  PLEl.innerText = 'Total ' + profitStat;
  PLValue.innerText = currency + Math.abs(sellPrice - buyPrice) * numStocks;
  percEl.innerText = `${profitStat} %`;
  percValue.innerText = (
    (Math.abs(sellPrice - buyPrice) * 100) /
    sellPrice
  ).toFixed(2);
  outputTable.classList.remove('hidden');
}

function doubleDigits(num) {
  return num.toString().padStart(2, '0');
}

function setMinMaxDate() {
  const today = new Date();
  const yearMax = doubleDigits(today.getFullYear());
  const yearMin = doubleDigits(today.getFullYear() - 1);
  const month = doubleDigits(today.getMonth() + 1);
  const dateMin = doubleDigits(today.getDate());
  const dateMax = doubleDigits(today.getDate() - 1);

  const dateStringMax = [yearMax, month, dateMax].join('-');
  const dateStringMin = [yearMin, month, dateMin].join('-');
  datePicker.setAttribute('max', dateStringMax);
  datePicker.setAttribute('min', dateStringMin);
}

function clearOutputs() {
  outputTable.classList.add('hidden');
  apiError.classList.add('hidden');
}

// Event Handler
async function formDataHandler(e) {
  e.preventDefault();
  clearOutputs();
  const formEntries = new FormData(form);

  const [ticker, exchange, date, numStocks] = [...formEntries.values()];
  console.log(ticker, exchange, date, numStocks);

  if (Number.parseInt(numStocks) <= 0) {
    displayInputErorr(true);
    return;
  }

  displayInputErorr(false);
  const buyPrice = await fetchData(ticker, exchange, date);
  const sellPrice = await fetchData(ticker, exchange, 'latest');

  if (buyPrice && sellPrice) outputDetails(buyPrice, sellPrice, +numStocks);
}

// Event Listener
form.addEventListener('submit', formDataHandler);

// Init
setMinMaxDate();
clearOutputs();
