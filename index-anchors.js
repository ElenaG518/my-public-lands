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
  // variable that will contain the string with the results
  const itemStringArray = [];
  // for (let i=0; i<item.data.length; i++) {
  //     console.log(item.data[i]);
  //   }

  // Iterate over a jQuery object, executing a function for each matched element.

  // ?? what is the $ referring to in the line below?
  // ?? when do I sent the item as a paramenter and not as
  // item.data.each(function(itemkey, itemvalue){...})

  $.each(item.data, function (itemkey, itemvalue) {
    let parkCode= itemvalue.parkCode;
    itemStringArray.push(`
      <div class="park">
        <h1>${itemvalue.fullName}</h1>
          <p>${itemvalue.description}</p>
          <h4>Weather:</h4><p> ${itemvalue.weatherInfo}</p>
          <div id="map">
            <iframe width="100%" height="450" frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/place?q=${itemvalue.fullName},${itemvalue.states}&key=AIzaSyBdNRsY4zEYnRfcQ0_ZVVd370D7yuApzhI" allowfullscreen>
          </iframe>
          </div> 

          <div class="alerts">
            <a class="park-alerts" href="#" id="alerts" data-name="${parkCode}">
            Alert information:</a>
            <button class="toggle hidden">Alert information:</button>
            <div class="alert-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>



          <div class="campgrounds">
           <a class="camping" href="#" id="campgrounds" data-name="${parkCode}">
            Campgrounds:</a>
            <button class="toggle hidden">Campgrounds:</button>
            <div class="camp-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>
          

          <a class="js-result-name" href="${itemvalue.url}" target="_blank"> 
          ${itemvalue.fullName} NPS website</a>
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
    alertStringArray.push(`<div class="al"<p>This park does not have any alerts at this time</p></div>`);
  } else {
      for (let i=0;i<result.data.length; i++) {
        alertStringArray.push(`<div class="al"><h3>${result.data[i].title}</h3>
        <h4>${result.data[i].category}</h4>
        <p>${result.data[i].description}</p>
       <p><a href="${result.data[i].url}" target"_blank">more information</a></p><div>`);
      };
  };    
  console.log(alertStringArray);
  renderAlertResult(alertStringArray);
};

// manipulate results and turn it into a string that will be used
// as the html to populate campground information for selected park

function displayParkSearchData(item) {
  console.log('displayParkSearchData function ran');
  const campgroundStringArray =[];
  if (item.data.length==0) {
    campgroundStringArray.push(`<div class="camp"><p>This park does not have any campgrounds.</p></div>`);
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
       <div class="camp">
       <h3>${itemvalue.name}</h3>
       <p>${itemvalue.description}</p> 
       <h4>Potable Water:</h4>
       <p>${water}</p>
       <h4>Toilets: </h4>
       <p>${toilets}</p>
       <h4>Showers:</h4>
       <p>${showers}</p>
       <h4>Campsites:</h4>
       <p>Total sites: ${itemvalue.campsites.totalSites}</p>
       <p>Electrical Hookups: ${itemvalue.campsites.electricalHookups}</p>
       <p>Group sites: ${itemvalue.campsites.group}</p>
       <p>RV only sites: ${itemvalue.campsites.rvOnly}</p>
       <p>Tent only sites: ${itemvalue.campsites.tentOnly}</p>
       </div>`);
      });
  };
  console.log(campgroundStringArray);
  renderParkResult(campgroundStringArray);    
};        
  
// function showErr(err) {
//   const outputElem = $('.js-output');
//   const errMsg = (
//     `<p>We couldn't find any National Parks related to your search term!</p>`
//   ); 
//   outputElem
//     .prop('hidden', false)
//     .html(errMsg);
// };


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

    // if using an input element
    // $('.js-form').on('click', event => {
    // let queryStateVal = $(event.currentTarget).find('.user-input').val();
  });

  // when user clicks on campground link, call API for campground information,
  // and show toggle button for campgrounds
  $('.js-output').on('click', '.camping', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`campground link has been clicked with with term ${queryPark}`);
    $(this).siblings('.toggle').removeClass('hidden');
    getParkDataFromApi(queryPark, displayParkSearchData);
  });


  // when user clicks on alert information link, call API for alert information,
  // and show toggle button for alerts
  $('.js-output').on('click', '.park-alerts', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`Alert link has been clicked with with term ${queryPark}`);
    $(this).siblings('.toggle').removeClass('hidden');
    getAlertDataFromApi(queryPark, displayAlertSearchData);

  });

  // when toggle button is pressed in Alert information section, either hides or displays 
  // div content without having to call API again.
  $('.js-output').on('click', '.toggle', function(event) {
    console.log('toggle button on alerts has been pressed');
    // $(event.currentTarget).closest('.alerts').toggleClass('hidden');
    $(this).siblings('.alert-results').toggleClass('hidden');
  });


  // when toggle button is pressed in campground section, either hides or displays 
  // div content without having to call API again.
  $('.js-output').on('click', '.toggle', function(event) {
    console.log('toggle button on campgrounds has been pressed');
    $(this).siblings('.camp-results').toggleClass('hidden');
  });
})