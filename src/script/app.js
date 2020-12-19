const APIKey = 'zpOgDArFTQol_ErrEKUk';
const form = document.querySelector('form');
const streetsElement = document.querySelector('.streets');
const tableBody = document.querySelector('tbody');
const streetDisplayTitle = document.getElementById('street-name');

const getStreets = (streetName) => {
  fetch('https://api.winnipegtransit.com/v3/streets.json?name=' + streetName + '&usage=long&api-key=' + APIKey)
    .then(response => response.json())
    .then(data => {
      if (data.streets.length > 0) {
        displayStreets(data.streets);
      } else {
        streetsElement.innerHTML = '<div class="no-results">No Streets found</div>';
      }
    });
};

const displayStreets = (streets) => {
  streetsElement.textContent = '';
  streets.forEach(street => {
    streetsElement.insertAdjacentHTML('beforeend', `
      <a href="#" data-street-key="${street.key}">${street.name}</a>
    `);
  });
};