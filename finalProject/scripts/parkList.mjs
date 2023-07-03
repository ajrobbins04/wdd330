import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         states,
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

    let parkSort = {};
    parkSort = getParksByState();
    console.log(parkSort);
    //getParksByRegion();
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
        parkSort = getParksByState();
   
 
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

function getParksByState() {

    let parksByState = {};
    let parksArray = [];

    states.forEach(async function (state) {
        let parks = await findByStateCode('parks?', state);
        parksArray = Array.from(parks.data);
        parksByState[`${state}`] = parksArray; 
    });
  
    return parksByState;
}

function getParksByRegion() {
 
    let parksByRegion = {};

    // most regions contain 2 - 3 sub-regions
    const northEastRegion = regions.northEastSubRegions;
    const midWestRegion = regions.midWestSubRegions;
    const southRegion = regions.southSubRegions;
    const westRegion = regions.westSubRegions;

    // its properties can be found in regions. there are
    // no sub-regions for the atlantic territories
    const atlanticRegion = regions;

    let majorRegions = [northEastRegion, midWestRegion,
    southRegion, westRegion, atlanticRegion];

    // get sub-region information for each region
        majorRegions.forEach((region) => {

        // each sub-region obj will be nested
        // inside the subRegions
        let subRegions = {};

        let subRegionArrays = Object.values(region);

        if (region !== atlanticRegion) {
            
            for (let i = 0; i < subRegionArrays.length; i+= 2) {

                let subRegionName= subRegionArrays[i];
                let subRegionStates = subRegionArrays[i + 1];

                subRegions[`${subRegionName}`] = subRegionStates;
            }
            
        } else {
            let subRegionName = subRegionArrays[8];
            let subRegionStates = subRegionArrays[9];

            subRegions[`${subRegionName}`] = subRegionStates;
        }

        
        Object.values(subRegions).forEach((subRegion) => {
            
            let subRegionParks = getSubRegionParks(subRegion);
        });
    });
}
async function getSubRegionParks(subRegion) {
   
    let subRegionParks = subRegion.map(getParksByState);
 
    for (let i = 0; i < Object.entries(subRegion).length; i++) {
        let parksInState = {};
        let state = subRegion[i];
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);

        // add parks to state
        parksInState[`${state}`] = {parks: parksArray};

        // add state to sub-region
        subRegionParks[`${subRegion}`] = {state: parksInState}; 
    }
    return subRegionParks; 
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