export function setPagePosition() {
  // y position of viewport window
  const currentPosition = window.scrollY;
  sessionStorage.setItem('pagePosition', currentPosition);
}


export function restorePagePosition() {
  console.log('Event listener called!')
  const savedPosition = sessionStorage.getItem('pagePosition');
  const restoredPosition = parseInt(savedPosition, 10);

  if (restoredPosition > 0) {
      window.scrollTo(0, restoredPosition);
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// retrieve data from localstorage
export function getLocalStorage(key) {

  // JSON.parse parses a JSON string to create
  // an object
  return JSON.parse(localStorage.getItem(key));
}

export function getParam(param) {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export async function renderListWithTemplate(templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = true) {
    if (clear) {
      parentElement.innerHTML = '';   
    }
    const htmlString = list.map(templateFn);
    parentElement.insertAdjacentHTML(position, htmlString.join(''));
  }

export async function renderNestedListWithTemplate(templateFn,
  parentElement,
  nestedList,
  position = 'afterbegin',
  clear = true) {
    if (clear) {
      parentElement.innerHTML = '';   
    }
    for (const list of nestedList) {
      const htmlString = list.map(templateFn);
      parentElement.insertAdjacentHTML(position, htmlString.join(''));
    } 
  }


export async function renderWithTemplate(templateFn,
  parentElement,
  data, 
  callback,
  position = 'afterbegin',
  clear = true) {
    if (clear) {
      parentElement.innerHTML = '';   
    }
  
    const htmlString = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlString);
  
    // callback function isn't always included
    if (callback) {
      callback(data);
    }
  
  }

function loadTemplate(path) {
  return async function() {

      // make fetch request to provided filepath
    const response = await fetch(path);
    if (response.ok) {

      // must process as text - not JSON
      const html = await response.text();
      return html;
    }
  }
}

export function selectRandomImage(park)
{
  const numImages = park.images.length;
  return (Math.floor(Math.random() * (numImages - 1)));
}

// year will be placed in footer, next to copyright
function getCurrentYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  return currentYear;
}

function updateFooter() {
  const currentYear = getCurrentYear();
  document.getElementById('copyright-year').textContent = currentYear;
}

// for the main search page
export function loadSearchPageHeaderFooter() {

  const headerTemplateFn = loadTemplate('./partials/header.html');
  const footerTemplateFn = loadTemplate('./partials/footer.html');

  const header = document.querySelector('#template-header');
  const footer = document.querySelector('#template-footer');

  renderWithTemplate(headerTemplateFn, header, {}, updateSearchPageHeader);
  renderWithTemplate(footerTemplateFn, footer, {}, updateFooter);
  
}

// only the 'Search Parks' header link will be underlined
function updateSearchPageHeader() {
  const searchPage = document.getElementById('search');
  const visitPage = document.getElementById('planVisit');

  searchPage.classList.add('active');

  if (visitPage.hasAttribute('active')) {
    visitPage.classList.remove('active')
  }
 
}

// only the 'Visit List' header link will be underlined
function updateVisitPageHeader() {
  const searchPage = document.getElementById('search');
  const visitPage = document.getElementById('planVisit');

  searchPage.classList.remove('active');
  visitPage.classList.add('active')
}

// for the visit list page
export function loadVisitPageHeaderFooter() {

  const headerTemplateFn = loadTemplate('./partials/header.html');
  const footerTemplateFn = loadTemplate('./partials/footer.html');

  const header = document.querySelector('#template-header');
  const footer = document.querySelector('#template-footer');

  renderWithTemplate(headerTemplateFn, header, {}, updateVisitPageHeader);
  renderWithTemplate(footerTemplateFn, footer, {}, updateFooter);
  
}

// neither of the header links will be underlined
function updateDetailsPageHeader() {
  const searchPage = document.getElementById('search');
  const visitPage = document.getElementById('planVisit');

  if (searchPage.hasAttribute('active')) {
    searchPage.classList.remove('active')
  }

  else if (visitPage.hasAttribute('active')) {
    visitPage.classList.remove('active')
  }
}

// for the park details page
export function loadDetailsPageHeaderFooter() {

  const headerTemplateFn = loadTemplate('./partials/header.html');
  const footerTemplateFn = loadTemplate('./partials/footer.html');

  const header = document.querySelector('#template-header');
  const footer = document.querySelector('#template-footer');

  renderWithTemplate(headerTemplateFn, header, {}, updateDetailsPageHeader);
  renderWithTemplate(footerTemplateFn, footer, {}, updateFooter);
  
}

export const states = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

export const regions =
[
  {northEast: [{newEngland: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT']}, 
               {middleAtlantic: ['NJ', 'NY', 'PA']}]
  }, 
  {midWest: [{eastNorthCentral: ['IN', 'IL', 'MI', 'OH', 'WI']},
             {westNorthCentral: ['IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD']}]
  }, 
  {south: [{southAtlantic: ['DE', 'DC', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'WV']}, 
           {eastSouthCentral: ['AL', 'KY', 'MS', 'TN']}, 
           {westSouthCentral: ['AR', 'LA', 'OK', 'TX']}]
  }, 
  {west: [{mountain: ['AZ', 'CO', 'ID', 'MT', 'NV', 'NM', 'UT', 'WY']}, 
          {pacific: ['AK', 'CA', 'HI', 'WA', 'OR']}]
  }, 
  {atlanticTerritories: [{atlanticTerritories: ['AS', 'GU', 'MP', 'PR', 'VI']}]}
];

export const regionNames = {
  northEast: 'NorthEast',
  newEngland: 'New England',
  middleAtlantic: 'Middle Atlantic',
  midWest: 'MidWest',
  eastNorthCentral: 'East North Central',
  westNorthCentral: 'West North Central',
  south: 'South',
  southAtlantic: 'South Atlantic',
  eastSouthCentral: 'East South Central',
  westSouthCentral: 'West South Central',
  west: 'West',
  mountain: 'Mountain',
  pacific: 'Pacific',
  atlanticTerritories: 'Atlantic Territories'
};
