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

    getParksByRegion();
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
    let parks_oneState = {};

    states.forEach(async function (state) {
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);
        parks_oneState = {parks: parksArray};
        parksByState[`${state}`] = parksInState; 
    });
  
    return parksByState;
}

function getParksByRegion() {

    // will store all parks sorted by
    // each major region, and further sorted
    // by each region's sub-regions
    let parksByRegion = {};

    // the only region w/o sub-regions is
    // the atlantic territories 
    const northEastRegions = regions.northEastSubRegions;
    const midWestRegions = regions.midWestSubRegions;
    const southRegions = regions.southSubRegions;
    const west = regions.westSubRegions;


    let allRegions = [northEastRegions, midWestRegions,
    southRegions, west];
   

    allRegions.forEach((majorRegion) => {
 
        let subRegions = [];
        let parks_oneRegion = {};

        // get number of subregions per major region.
        // divide b/c there are two subRegion obj. properties
        // for each subRegion
        let numSubRegions = (Object.keys(majorRegion).length) / 2;
       
            if (length === 2) {
                let subRegion1_states = majorRegion.subRegion1_stateCodes;
                let subRegion2_states = majorRegion.subRegion2_stateCodes;
                subRegions.push(subRegion1_states);
                subRegions.push(subRegion2_states);
            }

            // only south region
            else if (length === 3) {
                let subRegion1_states = majorRegion.subRegion1_stateCodes;
                let subRegion2_states = majorRegion.subRegion2_stateCodes;
                let subRegion3_states = majorRegion.subRegion3_stateCodes;
                subRegions.push(subRegion1_states);
                subRegions.push(subRegion2_states);
                subRegions.push(subRegion3_states);
            }    
            else {
                // doesn't need to go through subregions to access
                // the atlantic territories' state codes 
                subRegions.push(regions.atlantic_stateCodes);
            }

            let parks_oneSubRegion = {};
            let parks_oneState = {};

            // generate array
            subRegions.forEach(async function (subRegion) {

                for (let i = 0; i < subRegion.length; i++) {
                        let state = subRegion[i];
                        let parks = await findByStateCode('parks?', state);
                        let parksArray = Array.from(parks.data);
                        parks_oneState = {parks: parksArray};
                        parks_oneSubRegion[`${state}`] = parks_oneState; 
                     }
                     parks_oneRegion[`${subRegion}`] = parks_oneSubRegion;
                });
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