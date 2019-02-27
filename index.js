'use strict'

// global variable that will capture value of park visitor is interested in from
// GetStateDataFromApi function.
let queryPark;

// Get state input from user for search term.

const NPS_STATE_SEARCH_URL = 'https://api.nps.gov/api/v1/parks';

function getStateDataFromApi(stateTerm, callback) {
  console.log(`getStateFromApi function ran with ${stateTerm}`);
  const query = {
    stateCode: `${stateTerm}`,
    limit: 5,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_STATE_SEARCH_URL, query, callback)
      .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
});
};

// Get alert information from API when user clicks link to get alert information for
// selected park in the list of results

const NPS_ALERT_SEARCH_URL = 'https://api.nps.gov/api/v1/alerts';

function getAlertDataFromApi(parkTerm, callback) {
  console.log(`getAlerDataFromApi function ran with: ${parkTerm}`);
  const query = {
    parkCode: `${parkTerm}`,
    limit: 5,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };

  $.getJSON(NPS_ALERT_SEARCH_URL, query, callback)
      .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
  });
};


// get campground information from API when user clicks lnk to get campground info
// for selected park

const NPS_PARK_SEARCH_URL = 'https://api.nps.gov/api/v1/campgrounds';

function getParkDataFromApi(parkTerm, callback) {
  console.log(`getParkDataFromApi function ran with ${parkTerm}`);
  const query = {
    parkCode: `${parkTerm}`,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_PARK_SEARCH_URL, query, callback)
      .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
  });
};

// render results of list of parks by selected state

function renderResult(result) {
  console.log(`renderResult function ran`);
  $('.js-output')
  .prop('hidden', false)
  .html(result);
  $('footer').removeClass('hidden');
}

// render results of alerts for selected park
function renderAlertResult (alert) {
  console.log(`renderAlertResult function ran`);
  $(`.alert-results[data-name="${queryPark}"]`)
    .prop('hidden', false)
    .html(alert);
}

// render campground information for selected park
function renderParkResult(result) {
    console.log('renderParkResult function ran');
    $(`.camp-results[data-name="${queryPark}"]`)
    .prop('hidden', false)
    .html(result);
}

// manipulate results and turn it into a string that will be used
// as the html to populate national park information for selected state, in
// addittion to creating links to call in API for alerts and API for campgrounds
function displayStateSearchData(item) {
  console.log('displayStateSearchData function ran');
  console.log("answer ", item);
  // variable that will contain the string with the results
  const itemStringArray = [];
  
  // Iterate over a jQuery object, executing a function for each matched element.
  $.each(item.data, function (itemkey, itemvalue) {
    var mystring = `${itemvalue.fullName}`;
     mystring = mystring.replace('&','and');
     console.log(mystring);
    let parkCode= itemvalue.parkCode;
    itemStringArray.push(`
      <div class="park">
        <h1>${itemvalue.fullName}</h1>
        <div class="park-content">
          <p>${itemvalue.description}</p>
          <h4>Weather:</h4><p> ${itemvalue.weatherInfo}</p>
          
          <div class="map">
            <iframe title="map-${item.fullName}" width="100%" height="450" frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/place?q=${mystring},${itemvalue.states}&key=AIzaSyBdNRsY4zEYnRfcQ0_ZVVd370D7yuApzhI" allowfullscreen>
          </iframe>
          </div>
          <div class="info">
            <a class="park-alerts" href="#" data-name="${parkCode}">
            Alert information <i class="fas fa-plus right"></i></a>
            <button class="toggle-style toggle-alerts hidden">Alert information <i class="fas fa-minus right"></i></button>
            <div class="alert-results hidden" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>
          <div class="info">
           <a class="camping" href="#" data-name="${parkCode}">
            Campgrounds <i class="fas fa-plus right"></i></a>
            <button class="toggle-style toggle-camps hidden">Campgrounds <i class="fas fa-minus right"></i></button>
            <div class="camp-results hidden" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>
          <a class="js-result-name" href="${itemvalue.url}" target="_blank">
          ${itemvalue.fullName}</a>
        </div>
      </div>`
      );
  });
    renderResult(itemStringArray);
};


// manipulate results and turn it into a string that will be used
// as the html to populate alert information for selected park
function displayAlertSearchData(result) {
  console.log("displayAlertSearchData function ran");
  const alertStringArray =[];
  if (result.data.length==0) {
    alertStringArray.push(`<div class="expanded-info"><p class="no-info">This park does not have any alerts at this time</p></div>`);
  } else {
      for (let i=0;i<result.data.length; i++) {
        alertStringArray.push(`<div class="expanded-info">
        <h3>${result.data[i].title}</h3>
        <h4>${result.data[i].category}</h4>
        <p>${result.data[i].description}</p>
       <a href="${result.data[i].url}" target="_blank">more information</a>
       </div>`);
      };
  };
  console.log(alertStringArray);
  renderAlertResult(alertStringArray);
};

// manipulate results and turn it into a string that will be used
// as the html to populate campground information for selected park

function displayParkSearchData(item) {
  console.log('displayParkSearchData function ran');
  console.log('park answer ', item);
  const campgroundStringArray =[];
  if (item.data.length==0) {
    campgroundStringArray.push(`<div class="expanded-info"><p class="no-info">This park does not have any campgrounds.</p></div>`);
  } else {
    console.log(`item.data is`, item.data);

    for (let i=0; i<item.data.length; i++) {
      console.log(item.data[i]);
    }

    $.each(item.data, function (itemkey, itemvalue) {
        let code= itemvalue.parkCode;
        let water = [];
        let toilets=[];
        let showers=[];
        let resUrl;

        // create array for result for each amenity
        for (let i=0; i<itemvalue.amenities.potableWater.length; i++) {
            water.push(itemvalue.amenities.potableWater[i]);
        };
        console.log(`this is water`, water);

        for (let i=0; i<itemvalue.amenities.toilets.length; i++) {
             toilets.push(itemvalue.amenities.toilets[i]);
        };
        console.log(`this is toilets`, toilets);

        for (let i=0; i<itemvalue.amenities.showers.length; i++) {
             showers.push(itemvalue.amenities.showers[i]);
        };
        console.log(`this is showers`, showers);

       campgroundStringArray.push(`
       <h3>${itemvalue.name}</h3>
       <div class="expanded-info">
       <p>${itemvalue.description}</p>
       <p>Potable Water:  ${water}<br>
       Toilets: ${toilets}<br>
       Showers:  ${showers}<br>
       Campsites:<br>
       Total sites: ${itemvalue.campsites.totalSites}<br>
       Electrical Hookups: ${itemvalue.campsites.electricalHookups}<br>
       Group sites: ${itemvalue.campsites.group}<br>
       RV only sites: ${itemvalue.campsites.rvOnly}<br>
       Tent only sites: ${itemvalue.campsites.tentOnly}</p>
       </div>`);
      });
  };
  console.log(campgroundStringArray);
  renderParkResult(campgroundStringArray);
};


// when page is done loading, do the following:
$(function() {

  // hide landing page and show state options
  $('button').click(function() {
    $('.welcome').hide();
    $('.content').removeClass('hidden');
  });

  // when user changes the selection for state, take that input and call API
  $('.user-input').on('change', event => {
    event.preventDefault();
    let queryStateVal = $(event.currentTarget).val();
    console.log(`selections has been made with term ${queryStateVal}`);
    getStateDataFromApi(queryStateVal, displayStateSearchData);

   });

  
  // when user clicks on alert information link, call API for alert information,
  // and show toggle button for alerts
  $('.js-output').on('click', '.park-alerts', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`Alert link has been clicked with with term ${queryPark}`);
    $(this).siblings('.toggle-alerts').toggleClass('hidden');
    $(this).toggleClass('hidden');
    $(this).siblings('.alert-results').toggleClass('hidden');
    getAlertDataFromApi(queryPark, displayAlertSearchData);

  });

  // when toggle button is pressed in Alert information section, either hides or displays
  // div content without having to call API again.
  $('.js-output').on('click', '.toggle-alerts', function(event) {
    event.stopPropagation();
    console.log('toggle button on alerts has been pressed');
    // $(event.currentTarget).closest('.park-alerts').toggleClass('hidden');
    $(this).siblings('.park-alerts').toggleClass('hidden');
    $(this).siblings('.alert-results').toggleClass('hidden');
    $(this).toggleClass('hidden');
  });

// when user clicks on campground link, call API for campground information,
  // and show toggle button for campgrounds
  $('.js-output').on('click', '.camping', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`campground link has been clicked with with term ${queryPark}`);
    $(this).siblings('.toggle-camps').toggleClass('hidden');
    $(this).toggleClass('hidden');
    $(this).siblings('.camp-results').toggleClass('hidden');
    getParkDataFromApi(queryPark, displayParkSearchData);
  });

  // when toggle button is pressed in campground section, either hides or displays
  // div content without having to call API again.
  $('.js-output').on('click', '.toggle-camps', function(event) {
    event.stopPropagation();
    console.log('toggle button on campgrounds has been pressed');
    $(this).siblings('.camping').toggleClass('hidden');
    $(this).siblings('.camp-results').toggleClass('hidden');
    $(this).toggleClass('hidden');
  });
})