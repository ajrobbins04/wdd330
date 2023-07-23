import parksByState from './states.mjs';
import { renderListWithTemplate,
         selectRandomImage,
         regions,
         setPagePosition,
         restorePagePosition } from './utils.mjs';
import { states,
         convertStateAbbr } from './states.mjs';
import { apiFetch,
         findByStateCode } from './externalServices.mjs';

let allParks = null;
let allParksByRegion = null;

const resultsPerPage = 16;

export default async function parkList(selector) {

    //window.addEventListener('DOMContentLoaded', restorePagePosition);  

    // the element that all park results will be placed in
    const parentElement = document.querySelector(selector);  

    // for switching pages
    const prevBtn = document.getElementById('prevArrow');    
    const nextBtn = document.getElementById('nextArrow');

    // for viewing parks based on sort options, followed by result filters
    const options = document.getElementById('sortOptions');
    const stateFilterOptions = document.getElementById('stateFilter');
    const regionFilterOptions = document.getElementById('regionFilter');
   
    // retrive data for all parks
    if (!allParks) {
        let parks = await apiFetch();
        allParks = parks.data;
    }
   
    let currentPage = 1; 
    let finalPage = null;

    // set finalPage to total number of pages possible
    if (!finalPage) {
        finalPage = getNumPages(allParks);
    }

    // display first 10 park results on single page
    displayPage(allParks, parentElement, currentPage);
 
    // check if new page is clicked
    clickNewPage(allParks, parentElement, prevBtn, nextBtn, currentPage, finalPage);

    // organizes results based on the current sort option
    options.addEventListener('change', function() {
        const value = options.value;
        switchResultDisplay(parentElement, value, stateFilterOptions, 
            regionFilterOptions, prevBtn, nextBtn, finalPage);
    });
}


// find max number of pages possible based on number of parks
function getNumPages(parks) {

    const totalParkNum = Object.keys(parks).length;
    let totalPages = 0;

    try {
        totalPages = Math.ceil(totalParkNum / resultsPerPage);

        if (totalPages <= 0) {
            throw new Error('Total page must be greater than 0.');
        }
    } catch(error) {
        console.log('ERROR: ' + error.message);
    }
    return totalPages;
}


// displays parks results sorted by their names 
function displayPage(allParks, parentElement, currentPage) {
  
    // will use indices to slice parks data
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // make array with 16 parks that fall w/in the index range
    const parksPage = Array.from(allParks.slice(startIndex, endIndex));

    // render page display 
    renderListWithTemplate(parkResultTemplate, parentElement, parksPage);
}


// checks if user has clicked on a new page
function clickNewPage(parks, parentElement, prevBtn, nextBtn, 
                      currentPage, finalPage) {

    // scroll to top of page when new page is clicked
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
                    
    // update which buttons to display based on current page
    function updateButtons() {
        if (currentPage === 1) {
            prevBtn.classList.add('hide');
            nextBtn.classList.remove('hide');
        } else if (currentPage < finalPage) {
            prevBtn.classList.remove('hide');
            nextBtn.classList.remove('hide');
        } else {
            prevBtn.classList.remove('hide');
            nextBtn.classList.add('hide');
        }
    }

    updateButtons();

    nextBtn.addEventListener('click', function() {
        currentPage += 1;   // go forward 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > finalPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage);
            scrollToTop();
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });

    prevBtn.addEventListener('click', function () {
        currentPage -= 1;  // go back 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > finalPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage);
            scrollToTop();
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });
}


// called if user wants park results to be sorted differently
async function switchResultDisplay(parentElement, value,
     stateFilterOptions, regionFilterOptions, prevBtn, nextBtn, finalPage) {

    // must start on the first page regardless of
    // which new option is chosen
    let currentPage = 1;

    // sort by state
    if (value === 'state') {

        // remove selection table of region names if present
        if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }

        // add selection table of states
        stateFilterOptions.classList.remove('hide');

        parksByState(parentElement, prevBtn, nextBtn);
        
    // sort by region
    } else if (value === 'region') {

        // remove selection table of state names if present
        if (!stateFilterOptions.classList.contains('hide')) {
            stateFilterOptions.classList.add('hide');
        }

        // add selection table of regions
        regionFilterOptions.classList.remove('hide');

        if (!allParksByRegion) {
            allParksByRegion = await getParksByRegion(regions);
        }
  
        for (const [regionName, subRegions] of Object.entries(allParksByRegion)) {
            for (const subRegion of subRegions) {
              
                const stateNames = Object.keys(subRegion);
                const stateParks = Object.values(subRegion);
           
                // display park results by region
                renderListWithTemplate(parkResultTemplate, parentElement, Array.from(stateParks[0]));
            }
        }

    // sort parks by name from A - Z (the default option)
    } else {

        // remove unnecessary filter table used by the
        // previous filter option (state or region) selected
        if (!stateFilterOptions.classList.contains('hide')) {
            stateFilterOptions.classList.add('hide');
        }

        else if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }
        
        displayPage(allParks, parentElement, currentPage);
        clickNewPage(allParks, parentElement, prevBtn, nextBtn, currentPage, finalPage);
    }
    
}

async function getParksByRegion(regions) {
 
    let parksByRegion = {};

    const promises = regions.reverse().map(async (region) => {

        // access the one and only key-value pair in each
        // region object to get its name and subRegion names
        const regionName = Object.keys(region)[0];
        const subRegions = Object.values(region)[0];
        const parks = await Promise.all(
            subRegions.reverse().map((subRegion) => getParksBySubRegion(subRegion))
        );

        parksByRegion[regionName] = parks;
    });
    await Promise.all(promises);

    return parksByRegion;
}


async function getParksBySubRegion(subRegion) {

    const subRegionName = Object.keys(subRegion)[0];
    const states = Object.values(subRegion)[0];
 
    const promises = states.map(state => findByStateCode('parks?', state));
    const parksResponses = await Promise.all(promises);

    let subRegionParks = {};

    states.forEach((state, index) => {
        const parksArray = Array.from(parksResponses[index].data);
        subRegionParks[state] = parksArray;
    })
    
    return subRegionParks;
}


function parkResultTemplate(data) {

    const fullNameState = convertStateAbbr(data.states);
    const imageIndex = selectRandomImage(data);
 
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="state parkResult-state">Located in ${fullNameState}</p>
        <div class="hover overlay">
           <picture>
                <img class="park-img parkResult-img" src="${data.images[imageIndex].url}" alt="${data.images[0].altText}">
            </picture>
            <div class="overlay-description">
                <p class="description parkResult-description">${data.description}</p>
            </div>
        </div>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }

    // for parks without an image
    else {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="state parkResult-state">Located in ${fullNameState}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}