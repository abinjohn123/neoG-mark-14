'use strict';

const form = document.querySelector('.stock-form');
const datePicker = document.getElementById('date-picker');
const buyValueEl = document.querySelector('.buy-value');

const apiURL = 'http://api.marketstack.com/v1/eod';
const key = '35357d48e4870207f9881d6f81f0e793';

function fetchData(ticker, exchange, date) {
  const fetchURL = `${apiURL}/${date}?access_key=${key}&symbols=${ticker}.${exchange}`;

  console.log(fetchURL);

  fetch(fetchURL)
    .then((res) => res.json())
    .then(
      (json) => (buyValueEl.innerText = `Rs. ${Math.round(json.data[0].close)}`)
    )
    .catch((error) => console.log(error));
}

function setMaxDate() {
  function doubleDigits(num) {
    return num.toString().padStart(2, '0');
  }
  const today = new Date();
  const year = doubleDigits(today.getFullYear());
  const month = doubleDigits(today.getMonth() + 1);
  const date = doubleDigits(today.getDate() - 1);

  const dateString = [year, month, date].join('-');
  datePicker.setAttribute('max', dateString);
}

// Event Handler
function formDataHandler(e) {
  e.preventDefault();
  const formEntries = new FormData(form);

  const [ticker, exchange, date] = [...formEntries.values()];
  console.log(ticker, exchange, date);

  fetchData(ticker, exchange, date);
}

// Event Listener
form.addEventListener('submit', formDataHandler);

// Init
setMaxDate();
