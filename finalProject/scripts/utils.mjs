const baseURL = `https://developer.nps.gov/api/v1/parks?limit=50`;

export async function apiFetch() {
    const apiKey = 'dofSYJEmYCOaEjAr8dNzn9MdUkwJFbSHenA3X9Bv';
    const url = `https://developer.nps.gov/api/v1/parks?limit=50`;

    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {'X-Api-Key': apiKey}
    });
 
    if (response.ok) {
        const parkData = await response.json();
        return parkData;
    } else {
        throw Error(await response.text());
    }

    } catch (error) {
        console.log(error);
    }
}

  export function setLocalStorage(key, data) {}
  export function getLocalStorage(key) {}

  async function convertToJson(res) {
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw { name: "servicesError", message: data };
    }
  }

  export function getParam(param) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }

  export async function findParkById(id) {

    const response = await fetch(baseURL + `?parks=${id}`);
    const park = await convertToJson(response);
    return park.Result;
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
  export function getCurrentYear() {
    const date = new Date();
    const year = date.getFullYear();
    return year;
  }

  export function loadHeaderFooter() {
  
    const headerTemplateFn = loadTemplate('./partials/header.html');
    const footerTemplateFn = loadTemplate('./partials/footer.html');

    const header = document.querySelector('#template-header');
    const footer = document.querySelector('#template-footer');
  
   // const year = getCurrentYear();
   // document.querySelector('#copyright-year').textContent = ` ${year}`; 

    renderWithTemplate(headerTemplateFn, header);
    renderWithTemplate(footerTemplateFn, footer);
    
  }

  export function convertStateAbbr(states){

    // If one park has multiple states listed, then
    // it splits each state into its own substring.
    const abbrStates = states.split(',');

    let fullStates = [];
  
    abbrStates.forEach((state) => {
      // 'A' states
      if (state[0] === 'A') {
        if (state === 'AL') {
          const name = 'Alabama';
          fullStates.push(name);
        }
        else if (state === 'AK') {
          const name = 'Alaska';
          fullStates.push(name);
        }
        else if (state === 'AZ') {
          const name = 'Arizona';
          fullStates.push(name);
        }
        else if (state === 'AR') {
          const name = 'Arkansas';
          fullStates.push(name);
        }
        else if (state === 'AS') {
          const name = 'American Samoa';
          fullStates.push(name);
        }
      }
  
      // 'C' states
      else if (state[0] === 'C') {
        if (state === 'CA') {
          const name = 'California';
          fullStates.push(name);
        }
        else if (state === 'CO') {
          const name = 'Colorado';
          fullStates.push(name);
        }
        else if (state === 'CT') {
          const name = 'Connecticut';
          fullStates.push(name);
        }
      }

      // 'D' states
      else if (state[0] === 'D') {
        if (state === 'DE') {
          const name = 'Delaware';
          fullStates.push(name);
        }
        else if (state === 'DC') {
          const name = 'District of Columbia';
          fullStates.push(name);
        }
      }

      // Florida
      else if (state === 'FL') {
        const name = 'Florida';
        fullStates.push(name);
      }

      // 'G' state & territory
      else if (state[0] === 'G') {
        if (state === 'GA') {
          const name = 'Georgia';
          fullStates.push(name);
        }
        else if (state === 'GU') {
          const name = 'Guam';
          fullStates.push(name);
        }
    }

      // Hawaii
      else if (state === 'HI') {
        const name = 'Hawaii';
        fullStates.push(name);
      }

      // 'I' states
      else if (state[0] === 'I') {
        if (state === 'ID') {
          const name = 'Idaho';
          fullStates.push(name);
        }
        else if (state === 'IL') {
          const name = 'Illinois';
          fullStates.push(name);
        }
        else if (state === 'IN') {
          const name = 'Indiana';
          fullStates.push(name);
        }
        else if (state == 'IA') {
          const name = 'Iowa';
        }
      }

      // 'K' states
      else if (state[0] === 'K') {
        if (state === 'KS') {
          const name = 'Kansas';
          fullStates.push(name);
        }
        else if (state === 'KY') {
          const name = 'Kentucky';
          fullStates.push(name);
        }
      }

      // Louisiana
      else if (state === 'LA') {
        const name = 'Louisiana';
        fullStates.push(name);
      }

      // 'M' states
      else if (state[0] === 'M') {
        if (state === 'ME') {
          const name = 'Maine';
          fullStates.push(name);
        }
        else if (state === 'MD') {
          const name = 'Maryland';
          fullStates.push(name);
        }
        else if (state === 'MA') {
          const name = 'Massachusetts';
          fullStates.push(name);
        }
        else if (state === 'MI') {
          const name = 'Michigan';
          fullStates.push(name);
        }
        else if (state === 'MN') {
          const name = 'Minnesota';
          fullStates.push(name);
        }
        else if (state === 'MS') {
          const name = 'Mississippi';
          fullStates.push(name);
        }
        else if (state === 'MO') {
          const name = 'Missouri';
          fullStates.push(name);
        }
        else if (state === 'MT') {
          const name = 'Montana';
          fullStates.push(name);
        }
        else if (state === 'MP') {
          const name = 'Northern Mariana Islands';
          fullStates.push(name);
        }
      }

      // 'N' states
      else if (state[0] === 'N') {
        if (state === 'NE') {
          const name = 'Nebraska';
          fullStates.push(name);
        }
        else if (state === 'NV') {
          const name = 'Nevada';
          fullStates.push(name);
        }
        else if (state === 'NH') {
          const name = 'New Hampshire';
          fullStates.push(name);
        }
        else if (state === 'NJ') {
        const name = 'New Jersey';
        fullStates.push(name);
        }
        else if (state === 'NM') {
          const name = 'New Mexico';
          fullStates.push(name);
        }
        else if (state === 'NY') {
          const name = 'New York';
          fullStates.push(name);
        }
        else if (state === 'NC') {
          const name = 'North Carolina';
          fullStates.push(name);
        }
        else if (state === 'ND') {
          const name = 'North Dakota';
          fullStates.push(name);
        }
      }

      // 'O' states
      else if (state[0] === 'O') {
      if (state === 'OH') {
        const name = 'Ohio';
        fullStates.push(name);
      }
      else if (state === 'OK') {
        const name = 'Oklahoma';
        fullStates.push(name);
      }
      else if (state === 'OR') {
        const name = 'Oregon';
        fullStates.push(name);
      }
    }

    // 'P' state & territory
    else if (state[0] === 'P') {
      if (state === 'PA') {
        const name = 'Pennsylvania';
        fullStates.push(name);
      }
      else if (state === 'PR') {
        const name = 'Puerto Rico';
        fullStates.push(name);
      }
  }

    // Rhode Island
    else if (state === 'RI') {
      const name = 'Rhode Island';
      fullStates.push(name);
    }

    // 'S' states
    else if (state[0] === 'S') {
      if (state === 'SC') {
        const name = 'South Carolina';
        fullStates.push(name);
      }
      else if (state === 'SD') {
        const name = 'South Dakota';
        fullStates.push(name);
      }
    }

    // 'T' states
    else if (state[0] === 'T') {
      if (state === 'TN') {
        const name = 'Tennessee';
        fullStates.push(name);
      }
      else if (state === 'TX') {
        const name = 'Texas';
        fullStates.push(name);
      }
      else if (state === 'TT') {
        const name = 'Trust Territories';
        fullStates.push(name);
      }
    }

    // Utah
    else if (state === 'UT') {
      const name = 'Utah';
      fullStates.push(name);
    }

    // 'V' states
    else if (state[0] === 'V') {
      if (state === 'VT') {
        const name = 'Vermont';
        fullStates.push(name);
      }
      else if (state === 'VA') {
        const name = 'Virginia';
        fullStates.push(name);
      }
      else if (state === 'VI') {
        const name = 'Virgin Islands';
        fullStates.push(name);
      }
    }

    // 'W' states
    else if (state[0] === 'W') {
      if (state === 'WA') {
        const name = 'Washington';
        fullStates.push(name);
      }
      else if (state === 'WV') {
        const name = 'West Virginia';
        fullStates.push(name);
      }
      else if (state === 'WI') {
        const name = 'Wisconsin';
        fullStates.push(name);
      }
      else if (state === 'WY') {
        const name = 'Wyoming';
        fullStates.push(name);
      }
    }

    // No Name
    else {
      console.log("ERROR: No name found for " + state);
      const name = state;
      fullStates.push(name);
    }

  })
  return fullStates;
}