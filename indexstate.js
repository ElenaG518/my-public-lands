const NPS_SEARCH_URL = 'https://api.nps.gov/api/v1/parks';

function getDataFromApi(stateTerm, callback) {
  console.log(`display term from getDataFromApi function: ${stateTerm}`);
  const query = {
    stateCode: `${stateTerm}`,
    // parkCode: `${parkTerm}`,
    api_key: 'AIzaSyDE2RS2B27KuUp-G6TWpRFtLpySC36Zf3c',
    };
  $.getJSON(NPS_SEARCH_URL, query, callback)
      .fail(showErr);
}

function renderResult(result) {
  // console.log(`displaying from renderResult function: ${result}`);
  $('.js-output')
  .prop('hidden', false)
  .html(result);
}

function displayNPSSearchData(item) {
  // console.log(item);
  console.log(item.data[0]);
  // console.log(item.data[0].description);
  const itemStringArray = [];
  $.each(item.data, function (itemkey, itemvalue) {
    let parkCode= itemvalue.parkCode;
    itemStringArray.push(`
      <div>
      <h2>
      <a class="js-result-name" href="${itemvalue
      .url}" target="_blank">
      ${itemvalue.fullName}</a></h2>
      <p>${itemvalue.description}</p> 
      </div>`);
  
  });
  // console.log(itemStringArray);
  renderResult(itemStringArray);
}

function showErr(err) {
  const outputElem = $('.js-output');
  const errMsg = (`<p>We couldn't find any National Parks related to your search term!</p>`); 
  outputElem
    .prop('hidden', false)
    .html(errMsg);
}



$(function() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    // const queryPark = $(event.currentTarget).find('#js-park-query');
    // const queryParkVal = queryPark.val();
    const queryState = $(event.currentTarget).find('#js-state-query');
    const queryStateVal = queryState.val();
    console.log(`submit button has been pressed with term ${queryStateVal}`);
    // queryPark.val("");
    queryState.val("");
    getDataFromApi(queryStateVal, displayNPSSearchData);
  });
})