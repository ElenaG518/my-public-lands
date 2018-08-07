'use strict'
let queryPark;

const NPS_STATE_SEARCH_URL = 'https://api.nps.gov/api/v1/parks';

function getStateDataFromApi(stateTerm, callback) {
  console.log(`getStateFromApi function ran with ${stateTerm}`);
  const query = {
    stateCode: `${stateTerm}`,
    limit: 5,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_STATE_SEARCH_URL, query, callback)
      .fail(showErr);
};

const NPS_ALERT_SEARCH_URL = 'https://api.nps.gov/api/v1/alerts';

function getAlertDataFromApi(parkTerm, callback) {
  console.log(`getAlerDataFromApi function ran with: ${parkTerm}`);
  const query = {
    parkCode: `${parkTerm}`,
    limit: 5,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_ALERT_SEARCH_URL, query, callback)
      .fail(showErr);
};

const NPS_PARK_SEARCH_URL = 'https://api.nps.gov/api/v1/campgrounds';

function getParkDataFromApi(parkTerm, callback) {
  console.log(`getParkDataFromApi function ran with ${parkTerm}`);
  const query = {
    parkCode: `${parkTerm}`,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_PARK_SEARCH_URL, query, callback)
      .fail(showErr);
};

function renderResult(result) {
  console.log(`renderResult function ran`);
  $('.js-output')
  .prop('hidden', false)
  .html(result);
}

function renderAlertResult (alert) {
  console.log(`renderAlertResult function ran`);
  $(`.alert-results[data-name="${queryPark}"]`)
    .prop('hidden', false)
    .html(alert);
}

function renderParkResult(result) {
    console.log('renderParkResult function ran');
    $(`.camp-results[data-name="${queryPark}"]`)
    .prop('hidden', false)
    .html(result);
}

function displayStateSearchData(item) {
  console.log('displayStateSearchData function ran');
  const itemStringArray = [];
  for (let i=0; i<item.data.length; i++) {
      console.log(item.data[i]);
    }
  $.each(item.data, function (itemkey, itemvalue) {
    let parkCode= itemvalue.parkCode;
    itemStringArray.push(`
      <div class="park">
        <h2>${itemvalue.fullName}</h2>
          <p>${itemvalue.description}</p>
          <h3>Weather:</h3><p> ${itemvalue.weatherInfo}</p>
          <div id="map">
            <iframe width="100%" height="450" frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/place?q=${itemvalue.fullName},${itemvalue.states}&key=AIzaSyBdNRsY4zEYnRfcQ0_ZVVd370D7yuApzhI" allowfullscreen>
          </iframe>
          </div> 
          <div class="alerts">
            <p><a class="park-alerts" href="#" id="alerts" data-name="${parkCode}">
            Alert information:</a></p>
            <div class="alert-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>
          <div class="campgrounds">
            <p><a class="camping" href="#" id="campgrounds" data-name="${parkCode}">
            Campground information:</a></p>
            <div class="camp-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
          </div>
          <p><a class="js-result-name" href="${itemvalue.url}" target="_blank"> 
          ${itemvalue.fullName} NPS website</a></p>
      </div>`
      );
  });
    renderResult(itemStringArray);
};

function displayAlertSearchData(result) {
  console.log("displayAlertSearchData function ran");
  const alertStringArray =[];
  if (result.data.length==0) {
    alertStringArray.push(`<p>This park does not have any alerts at this time</p>`);
  } else {
      for (let i=0;i<result.data.length; i++) {
        alertStringArray.push(`<div class="al"><h3>${result.data[i].title}</h3>
        <p>${result.data[i].category}</p>
        <p>${result.data[i].description}
       <br><a href="${result.data[i].url}" target"_blank">more information</a></p><div>`);
      };
  };    
  console.log(alertStringArray);
  renderAlertResult(alertStringArray);
};

function displayParkSearchData(item) {
  console.log('displayParkSearchData function ran');
  const campgroundStringArray =[];
  if (item.data.length==0) {
    campgroundStringArray.push(`<div class="camp"><p>This park does not have any campgrounds.</p></div>`);
  } else {
    console.log(`item.data is`, item.data);

    // for (let i=0; i<item.data.length; i++) {
    //   console.log(item.data[i]);
    // }

    $.each(item.data, function (itemkey, itemvalue) {
        let code= itemvalue.parkCode;
        let water = [];
        let toilets=[];
        let showers=[];
        let resUrl;
        
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
       <h2>${itemvalue.name}</h2>
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
       <p>Total sites: ${itemvalue.campsites.totalSites}</p>
       </div>`);
      });
  };
  console.log(campgroundStringArray);
  renderParkResult(campgroundStringArray);    
};        
  
function showErr(err) {
  const outputElem = $('.js-output');
  const errMsg = (
    `<p>We couldn't find any National Parks related to your search term!</p>`
  ); 
  outputElem
    .prop('hidden', false)
    .html(errMsg);
};

$(function() {
  
  $('button').click(function() {
    $('.welcome').hide();
    $('.content').removeClass('hidden');
  });
  
  $('.user-input').on('change', event => {
    event.preventDefault();
    let queryStateVal = $(event.currentTarget).val();
    console.log(`selections has been made with term ${queryStateVal}`);
    getStateDataFromApi(queryStateVal, displayStateSearchData);

    // if using an input element
    // $('.js-form').on('click', event => {
    // let queryStateVal = $(event.currentTarget).find('.user-input').val();
  });

  $('.js-output').on('click', '.camping', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`campground link has been clicked with with term ${queryPark}`);
    getParkDataFromApi(queryPark, displayParkSearchData);
  });

  $('.js-output').on('click', '.park-alerts', function() {
    event.preventDefault();
    queryPark = $(this).attr('data-name');
    console.log(`Alert link has been clicked with with term ${queryPark}`);
    getAlertDataFromApi(queryPark, displayAlertSearchData);
  });
})