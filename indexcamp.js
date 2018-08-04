'use strict'
let queryPark;


const NPS_STATE_SEARCH_URL = 'https://api.nps.gov/api/v1/parks';

function getStateDataFromApi(stateTerm, callback) {
  console.log(`display term from getStateFromApi function: ${stateTerm}`);
  const query = {
    stateCode: `${stateTerm}`,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_STATE_SEARCH_URL, query, callback)
      .fail(showErr);
};

const NPS_PARK_SEARCH_URL = 'https://api.nps.gov/api/v1/campgrounds';

function getParkDataFromApi(parkTerm, callback) {
  console.log(`display term from getParkDataFromApi function: ${parkTerm}`);
  const query = {
    parkCode: `${parkTerm}`,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
  };
  $.getJSON(NPS_PARK_SEARCH_URL, query, callback)
      .fail(showErr);
};

function renderResult(result) {
  // console.log(`displaying from renderResult function: ${result}`);
  $('.js-output')
  .prop('hidden', false)
  .html(result);
}

function renderParkResult(result) {
    console.log('renderParkResult ran');
    $(`.camp-results[data-name="${queryPark}"]`)
    .prop('hidden', false)
    .html(result);
}

function displayParkSearchData(item) {
  // console.log(`displayParkSearchData has returned this`, item);
  const campgroundStringArray =[];
  if (item.data.length==0) {
    campgroundStringArray.push(`<p>This park does not have any campgrounds.</p>`);
  } else {
    console.log(`item.data is`, item.data);

    for (let i=0; i<item.data.length; i++) {
      console.log(item.data[i]);
    }

    $.each(item.data, function (itemkey, itemvalue) {
        let code= itemvalue.parkCode;
        campgroundStringArray.push(`<div>`);
        campgroundStringArray.push(`

          <h2>${itemvalue.name}</h2>
          <p>${itemvalue.description}</p> 
          <h3>Ammenities</h3>
          <h4>Potable Water:</h4><p>`);
        for (let i=0; i<itemvalue.amenities.potableWater.length; i++) {
            campgroundStringArray.push(`${itemvalue.amenities.potableWater[i]}`);
          };
          campgroundStringArray.push(`</p><h4>Toilets: </h4>`);
          for (let i=0; i<itemvalue.amenities.toilets.length; i++) {
            campgroundStringArray.push(`<p>${itemvalue.amenities.toilets[i]}</p>`);
          };
          campgroundStringArray.push(`<h4>Showers:</h4> `);
          for (let i=0; i<itemvalue.amenities.showers.length; i++) {
            campgroundStringArray.push(`${itemvalue.amenities.showers[i]} </p>`);
          };
          campgroundStringArray.push(`<h4>Campsites:</h4>
          <p>Total sites: ${itemvalue.campsites.totalSites}</p>
          <p>Electrical Hookups: ${itemvalue.campsites.electricalHookups}</p>
          <p>Group sites: ${itemvalue.campsites.group}</p>
          <p>RV only sites: ${itemvalue.campsites.rvOnly}</p>
          <p>Tent only sites: ${itemvalue.campsites.tentOnly}</p>
          <p>Total sites: ${itemvalue.campsites.totalSites}</p>
          `);
          if(itemvalue.reservationsUrl!='') {
          campgroundStringArray.push(`<p><a href ="${itemvalue.reservationsUrl}" target="_blank">Click here for online reservations!</a>`);
          }
          campgroundStringArray.push(`</div>`);
    });
  };
  
  // console.log(campgroundStringArray);
  renderParkResult(campgroundStringArray);
}

function displayStateSearchData(item) {
  // console.log(item);
  // console.log(item.data[0]);
  // console.log(item.data[0].description);
  const itemStringArray = [];
  $.each(item.data, function (itemkey, itemvalue) {
    let parkCode= itemvalue.parkCode;
    // console.log(itemvalue.parkCode);
    itemStringArray.push(`
      <div>
        <h2>${itemvalue.fullName}</h2>
          <p>${itemvalue.description}</p>
          <h3>Weather:</h3><p> ${itemvalue.weatherInfo}</p> 
          <p><a class="camping" href="#" id="${parkCode}">
          Campground information:</a></p>
          <div class="camp-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
          <a class="js-result-name" href="${itemvalue.url}" target="_blank">additional information on 
          ${itemvalue.fullName}</a>
      </div>
      `);
  });
    renderResult(itemStringArray);
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
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryState = $(event.currentTarget).find('#js-state-query');
    const queryStateVal = queryState.val();
    console.log(`submit button has been pressed with term ${queryStateVal}`);
    // queryPark.val("");
    queryState.val("");
    getStateDataFromApi(queryStateVal, displayStateSearchData);
  });

  $('.js-output').on('click', '.camping', function() {
    event.preventDefault();
    queryPark = $(this).attr('id');
    console.log(queryPark);
    getParkDataFromApi(queryPark, displayParkSearchData);
  });
})