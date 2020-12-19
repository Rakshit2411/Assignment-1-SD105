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

const getBuses = (bus) => {
  fetch('https://api.winnipegtransit.com/v3/stops.json?street=' + bus + '&api-key=' + APIKey)
    .then(response => response.json())
    .then(data => {
      const stop = data.stops.map(place => {
        return fetch('https://api.winnipegtransit.com/v3/stops/' + place.key + '/schedule.json?max-results-per-route=2&api-key=' + APIKey);
      });
      streetDisplayTitle.textContent = 'Displaying results for ' + data.stops[0].street.name;
      printdata(stop);
    });
};

const printdata = (stopPoint) => {
  tableBody.textContent = '';
  Promise.all(stopPoint)
    .then(response => {
      response.forEach(outcome => {
        outcome.json()
          .then(data => {
            data['stop-schedule']['route-schedules'].forEach(schedules => {
              const time = new Date(schedules['scheduled-stops'][0].times.arrival.scheduled);
              const time2 = new Date(schedules['scheduled-stops'][1].times.arrival.scheduled);
              console.log(time.getHours());
              tableBody.insertAdjacentHTML('afterbegin', `
                <tr>
                  <td>${data['stop-schedule'].stop.street.name}</td>
                  <td>${data['stop-schedule'].stop['cross-street'].name}</td>
                  <td>${data['stop-schedule'].stop.direction}</td>
                  <td>${schedules.route.number}</td>
                  <td>${time.toLocaleTimeString([], { 'hour': '2-digit', 'minute': '2-digit' })}</td>
                </tr>
                <tr>
                  <td>${data['stop-schedule'].stop.street.name}</td>
                  <td>${data['stop-schedule'].stop['cross-street'].name}</td>
                  <td>${data['stop-schedule'].stop.direction}</td>
                  <td>${schedules.route.number}</td>
                  <td>${time2.toLocaleTimeString([], { 'hour': '2-digit', 'minute': '2-digit' })}</td>
                </tr>
              `);
            });
          });
      });
    });
};