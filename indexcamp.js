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
    // console.log(item.data[0]);

    $.each(item.data, function (itemkey, itemvalue) {
      let code= itemvalue.parkCode;
        campgroundStringArray.push(`
        <div>
          <h2>
          <a class="js-result-name" href="${itemvalue.url}" target="_blank">
          ${itemvalue.name}</a></h2>
          <p>Description: ${itemvalue.description}</p> 
          <p>Weather Overview: ${itemvalue.weatherOverview}</p>
          <p>Toilets: ${itemvalue.amenities.toilets[0]}</p>
          <p>Showers ${itemvalue.amenities.showers[0]}</p>
          <p>Potable Water: ${itemvalue.amenities.potableWater[0]}${itemvalue.amenities.potableWater[1]} </p>
          <p>Total sites: ${itemvalue.campsites.totalSites}</p>
          <p>Tent only sites: ${itemvalue.campsites.tentOnly}</p>
        </div>`);
    });
  };
  console.log(item.data.length);
  console.log(campgroundStringArray);
  renderParkResult(campgroundStringArray);
}

function displayStateSearchData(item) {
  // console.log(item);
  console.log(item.data[0]);
  // console.log(item.data[0].description);
  const itemStringArray = [];
  $.each(item.data, function (itemkey, itemvalue) {
    let parkCode= itemvalue.parkCode;
    // console.log(itemvalue.parkCode);
    itemStringArray.push(`
      <div>
        <h2>
          <a class="js-result-name" href="${itemvalue.url}" target="_blank">
          ${itemvalue.fullName}</a></h2>
          <p>${itemvalue.description}</p> 
          <p><a class="camping" href="#" id="${parkCode}">
          Campground information:</a></p>
          <div class="camp-results" aria-live="assertive" data-name="${parkCode}" hidden></div>
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
    queryPark = $(this).attr('id');
    // const queryName = $(this)attr('data-name');
    console.log(queryPark);
    getParkDataFromApi(queryPark, displayParkSearchData);
    });
})