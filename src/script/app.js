// constants to use in program.
const APIKey = 'zpOgDArFTQol_ErrEKUk';
const tableBody = document.querySelector('tbody');
const streetDisplayTitle = document.getElementById('street-name');

// The following function will accept a parameter and get the street names from the API. 
// Check if the street exist or not. 
// Use one other function to display them on the web. 
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

// The following function will accept a parameter and target street element from the html file and 
// add the data in that element to display on the web. 
const displayStreets = (streets) => {
  streetsElement.textContent = '';
  streets.forEach(street => {
    streetsElement.insertAdjacentHTML('beforeend', `
      <a href="#" data-street-key="${street.key}">${street.name}</a>
    `);
  });
};

// The following function will accept one parameter and get the data for perticular street. 
// Will use one other function to print all data.
const getBuses = (bus) => {
  fetch('https://api.winnipegtransit.com/v3/stops.json?street=' + bus + '&api-key=' + APIKey)
    .then(response => response.json())
    .then(data => {
      streetDisplayTitle.textContent = 'Displaying results for ' + data.stops[0].street.name;
      const stop = data.stops.map(place => {
        return fetch('https://api.winnipegtransit.com/v3/stops/' + place.key + '/schedule.json?max-results-per-route=2&api-key=' + APIKey);
      });
      printdata(stop);
    });
};

// The following function accepts a parameter and it prints all the information on the web. 
// It target the tbody element of index file and add the data in it. 
// It also uses the Promise.all() method. 
// This function also uses ".toLocaleTimeString()" method to just show two digits for hours and minutes.  
// you can check that method at "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString"
const printdata = (stopPoint) => {
  tableBody.textContent = '';
  Promise.all(stopPoint)
    .then(response => {
      response.forEach(outcome => {
        outcome.json()
          .then(data => {
            data['stop-schedule']['route-schedules'].forEach(schedules => {
              // two constants to use two upcomming times for each route.
              const time = new Date(schedules['scheduled-stops'][0].times.arrival.scheduled);
              const time2 = new Date(schedules['scheduled-stops'][1].times.arrival.scheduled);
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

// constants to add eventlisteners in the program.
const form = document.querySelector('form');
const streetsElement = document.querySelector('.streets');

// A click eventlistener for stops. 
streetsElement.addEventListener('click', (event) => {
  if (event.target.nodeName === 'A') {
    getBuses(event.target.dataset.streetKey);
  }
});

// a submit eventlistener for input field.
form.addEventListener('submit', (e) => {
  const input = e.target.querySelector('input');
  if (input.value != '') { //check if the field is empty or not. 
    getStreets(input.value);
  }
  e.preventDefault();
});