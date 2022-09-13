'use strict';

const form = document.querySelector('.stock-form');
const datePicker = document.getElementById('date-picker');
const numStocksEl = document.getElementById('num-stocks');
const buyValueEl = document.querySelector('.buy-value');
const sellValueEl = document.querySelector('.sell-value');

const apiURL = 'http://api.marketstack.com/v1/eod';
const key = '35357d48e4870207f9881d6f81f0e793';

function displayErorr(flag) {
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

async function fetchData(ticker, exchange, date) {
  const fetchURL = `${apiURL}/${date}?access_key=${key}&symbols=${ticker}.${exchange}`;

  const urlData = await fetch(fetchURL);

  if (!urlData.status === 422) {
    console.log('error', urlData);
    return;
  }

  const json = await urlData.json();
  return Math.round(json.data[0].close);
}

function outputPrice(buy, sell) {
  buyValueEl.innerText = buy;
  sellValueEl.innerText = sell;
}

function doubleDigits(num) {
  return num.toString().padStart(2, '0');
}

function setMaxDate() {
  const today = new Date();
  const year = doubleDigits(today.getFullYear());
  const month = doubleDigits(today.getMonth() + 1);
  const date = doubleDigits(today.getDate() - 1);

  const dateString = [year, month, date].join('-');
  datePicker.setAttribute('max', dateString);
}

// Event Handler
async function formDataHandler(e) {
  e.preventDefault();
  const formEntries = new FormData(form);

  const [ticker, exchange, date, numStocks] = [...formEntries.values()];
  console.log(ticker, exchange, date, numStocks);

  displayErorr(Number.parseInt(numStocks) <= 0);

  const buyPrice = await fetchData(ticker, exchange, date);
  const sellPrice = await fetchData(ticker, exchange, 'latest');

  outputPrice(buyPrice, sellPrice);
}

// Event Listener
form.addEventListener('submit', formDataHandler);

// Init
setMaxDate();
