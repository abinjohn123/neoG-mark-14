'use strict';

const form = document.querySelector('.stock-form');
const buyValueEl = document.querySelector('.buy-value');

const apiURL = 'http://api.marketstack.com/v1/eod';
const key = '35357d48e4870207f9881d6f81f0e793';

function fetchData(exchange, date) {
  const fetchURL = `${apiURL}/${date}?access_key=${key}&symbols=RELIANCE.${exchange}`;

  console.log(fetchURL);

  fetch(fetchURL)
    .then((res) => res.json())
    .then(
      (json) => (buyValueEl.innerText = `Rs. ${Math.round(json.data[0].close)}`)
    )
    .catch((error) => console.log(error));
}

// Event Handler
function formDataHandler(e) {
  e.preventDefault();
  const formEntries = new FormData(form);

  const [exchange, date] = [...formEntries.values()];
  console.log(exchange, date);

  fetchData(exchange, date);
}

// Event Listener
form.addEventListener('submit', formDataHandler);
