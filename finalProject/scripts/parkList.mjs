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

        let subRegions = [];

        // each sub-region obj will be nested
        // inside the subRegions
        let subRegion = {};

        let subRegionArrays = Object.values(region);

        if (region !== atlanticRegion) {
            
            for (let i = 0; i < subRegionArrays.length; i+= 2) {

                let subRegionName = subRegionArrays[i];
                let subRegionStates = subRegionArrays[i + 1];

                subRegion[`${subRegionName}`] = {states: subRegionStates};
                subRegions.push(subRegion);
            }
            
        } else {
            let subRegionName = subRegionArrays[8];
            let subRegionStates = subRegionArrays[9];

            subRegion[`${subRegionName}`] = {states: subRegionStates};
            subRegions.push(subRegion);
        }

        subRegions.forEach((subRegion) => {
            let parks_subRegion = getSubRegionParks(subRegion);
        });
        
        console.log(subRegions);
        
    });


        // get parks from each region's sub-region
        allSubRegions.forEach((subRegion) => {

            let parks_subRegion = getSubRegionParks(subRegion);
         
            // nest the sub-region's parks inside its major region
            parks_majorRegion[`${subRegion}`] = parks_subRegion;
            console.log(parks_majorRegion);
        });      
}
 
async function getSubRegionParks(subRegion) {

    let parks_subRegion = {};

    for (let i = 0; i < subRegion.length; i++) {
        let parksInState = {};
        let state = subRegion[i];
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);

        // add parks to state
        parksInState[`${state}`] = {parks: parksArray};

        // add state to sub-region
        parks_subRegion[`${subRegion}`] = {state: parksInState}; 
    }

    return parks_subRegion; 
}

/*function getSubRegions(allRegions) {
  
    let allMajorRegions = [];
    allRegions.forEach((majorRegion) => {
   
        if (majorRegion.length > 1 ) {
        
            // must divide b/c there are two subRegion obj. properties
            // for each subRegion
            let numSubRegions = (Object.keys(majorRegion).length) / 2;
       
            // northEast, midWest, and west regions
            if (length === 2) {
                let allSubRegions = [];

                let subRegion1 = {name: majorRegion.subRegion1, 
                    states: majorRegion.subRegion1_stateCodes};
                let subRegion2 = {name: majorRegion.subRegion2, 
                    states: majorRegion.subRegion2_stateCodes};
      
                allSubRegions.push(subRegion1);
                allSubRegions.push(subRegion2);
                    
                if (subRegion1.name === 'New England') {
                    let majorRegion = {name: 'Northeast', 
                    subRegions: allSubRegions};
                }
                else if (subRegion1.name === 'Mountain') {
                    let majorRegion = {name: 'West', 
                    subRegions: allSubRegions};
                } else {
                    let majorRegion = {name: 'Midwest', 
                    subRegions:  allSubRegions};
                }
                allMajorRegions.push(allSubRegions);
            }

            // only south region
            else if (length === 3) {

                let allSubRegions = [];

                let subRegion1 = {name: majorRegion.subRegion1, 
                                states: majorRegion.subRegion1_stateCodes};
                let subRegion2 = {name: majorRegion.subRegion2, 
                                states: majorRegion.subRegion2_stateCodes};
                let subRegion3 = {name: majorRegion.subRegion3, 
                                states: majorRegion.subRegion3_stateCodes};

                allSubRegions.push(subRegion1);
                allSubRegions.push(subRegion2);
                allSubRegions.push(subRegion3);

                let majorRegion = {name: 'South', 
                    subRegions: allSubRegions};

                allMajorRegions.push(allSubRegions);
                console.log(allMajorRegions);
            }  
        } else {
            let allSubRegions = [];

            // add stateCodes from the atlatic territories region
            let subRegion1 = {name: majorRegion.atlanticTerritories, 
                states: majorRegion.atlantic_stateCodes};

            allSubRegions.push(subRegion1);
            let majorRegion = {name: 'Atlantic Territories', 
            subRegions: allSubRegions};

            allMajorRegions.push(allSubRegions);
        }
      
    });
        
   
    return allSubRegions;
}*/

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