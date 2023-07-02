import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         locations,
         regions } from './utils.mjs';
import { apiFetch,
         findByStateCode } from './externalServices.mjs';

export default async function parkList(selector) {

    const parks = await apiFetch();
    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));

    console.log(parks);
  
    // organizes results based on the current sort option
    const option = document.getElementById('sortOptions');
    option.addEventListener('change', switchResultDisplay);

    sortByRegion();
    //const locationCheckboxes = document.querySelectorAll('.locationBox');
    //locationCheckboxes.forEach((box) => {
        //box.addEventListener('click', includeInSearch);
    //})

}

function switchResultDisplay(element, parks) {

    const locationFilterOptions = document.getElementById('locationFilter');
    const regionFilterOptions = document.getElementById('regionFilter');
    let parkSort = {};

    // sort by location
    if (this.value === 'location') {

        /*if (!regionFilterOptions.hasAttribute('hide')) {
            regionFilterOptions.setAttribute('hide');
        }*/
        locationFilterOptions.classList.remove('hide');
        parkSort = sortByLocation();
   
 
    // sort by region
    } else if (this.value === 'region') {

        if (!locationFilterOptions.hasAttribute('hide')) {
            locationFilterOptions.setAttribute('hide');
        }
        regionFilterOptions.classList.remove('hide');
 
    // sort A - Z
    } else {
        renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));
    }
    

}

function sortByLocation() {

    let parksByLocation = {};
    let parksInLocation = {};

    locations.forEach(async function (location) {
        let parks = await findByStateCode('parks?', location);
        let parksArray = Array.from(parks.data);
        parksInLocation = {parks: parksArray};
        parksByLocation[`${location}`] = parksInLocation; 
    });
 
  
    return parksByLocation;
}

function sortByRegion() {

    // each major region has 2-3 subregions except
    // for the atlantic territories
    const northEastRegions = regions.northEastSubRegions;
    const midWestRegions = regions.midWestSubRegions;
    const southRegions = regions.southSubRegions;
    const west = regions.westSubRegions;

    // doesn't need to go through subregions to access
    // this region's state codes
    const atlanticStateCodes = regions.atlantic_stateCodes;
  
    // will hold the stateCodes contained in each subRegion
    let subRegionLocations = [];

    allRegions.forEach((region) => {

        console.log(region);
        // get number of subregions per major region
        let length = Object.keys(region[1]).length;
       
        // Atlantic territories not included b/c doesn't
        // have any subregions
        if (length != 5) {
            for (let i = 0; i < length; i++) {
               
                // contains all the subRegion arrays
                // for each major region
                let majorRegion = Object.values(region[1]);

                // access each subRegion array
                majorRegion.forEach((subRegion) => {
                     for (let i = 0; i < subRegion.length; i++) {

                        // will be a stateCode value
                        let location = subRegion[i];
                     }
                });
            }
        }

        else {
            let territories = region.atlanticTerritories;
            console.log(territories);
        }
    });
}
 

function includeInLocationSort() {
    
}


function parkResultTemplate(data) {
 
    const fullStates = convertStateAbbr(data.states);
    const imageIndex = selectRandomImage(data);
 
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
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
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}