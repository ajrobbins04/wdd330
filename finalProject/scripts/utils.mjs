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
  export function getParam(param) {}

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
  
  export function convertStateAbbr(state){

    // 'A' states
    if (state[0] === 'A') {
      if (state === 'AL') {
        const name = 'Alabama';
        return name;
      }
      else if (state === 'AK') {
        const name = 'Alaska';
        return name;
      }
      else if (state === 'AZ') {
        const name = 'Arizona';
        return name;
      }
      else if (state === 'AR') {
        const name = 'Arkansas';
        return name;
      }
    }
  
    // 'C' states
    else if (state[0] === 'C') {
      if (state === 'CA') {
        const name = 'California';
        return name;
      }
      else if (state === 'CO') {
        const name = 'Colorado';
        return name;
      }
      else if (state === 'CT') {
        const name = 'Connecticut';
        return name;
      }
    }

    // 'D' states
    else if (state[0] === 'D') {
      if (state === 'DE') {
        const name = 'Delaware';
        return name;
      }
      else if (state === 'DC') {
        const name = 'District of Columbia';
        return name;
      }
    }

    // Florida
    else if (state === 'FL') {
      const name = 'Florida';
      return name;
    }

    // Georgia
    else if (state === 'GA') {
      const name = 'Georgia';
      return name;
    }

    // Hawaii
    else if (state === 'HI') {
      const name = 'Hawaii';
      return name;
    }

    // 'I' states
    else if (state[0] === 'I') {
      if (state === 'ID') {
        const name = 'Idaho';
        return name;
      }
      else if (state === 'IL') {
        const name = 'Illinois';
        return name;
      }
      else if (state === 'IN') {
        const name = 'Indiana';
        return name;
      }
      else if (state == 'IA') {
        const name = 'Iowa';
      }
    }

    // 'K' states
    else if (state[0] === 'K') {
      if (state === 'KS') {
        const name = 'Kansas';
        return name;
      }
      else if (state === 'KY') {
        const name = 'Kentucky';
        return name;
      }
    }

    // Louisiana
    else if (state === 'LA') {
      const name = 'Louisiana';
      return name;
    }

    // 'M' states
    else if (state[0] === 'M') {
      if (state === 'ME') {
        const name = 'Maine';
        return name;
      }
      else if (state === 'MD') {
        const name = 'Maryland';
        return name;
      }
      else if (state === 'MA') {
        const name = 'Massachusetts';
        return name;
      }
      else if (state === 'MI') {
        const name = 'Michigan';
        return name;
      }
      else if (state === 'MN') {
        const name = 'Minnesota';
        return name;
      }
      else if (state === 'MS') {
        const name = 'Mississippi';
        return name;
      }
      else if (state === 'MO') {
        const name = 'Missouri';
        return name;
      }
      else if (state === 'MI') {
        const name = 'Montana';
        return name;
      }
    }

     // 'N' states
    else if (state[0] === 'N') {
      if (state === 'NE') {
        const name = 'Nebraska';
        return name;
      }
      else if (state === 'NV') {
        const name = 'Nevada';
        return name;
      }
      else if (state === 'NH') {
        const name = 'New Hampshire';
        return name;
      }
      else if (state === 'NJ') {
        const name = 'New Jersey';
        return name;
      }
      else if (state === 'NM') {
        const name = 'New Mexico';
        return name;
      }
      else if (state === 'NY') {
        const name = 'New York';
        return name;
      }
      else if (state === 'NC') {
        const name = 'North Carolina';
        return name;
      }
      else if (state === 'ND') {
        const name = 'North Dakota';
        return name;
      }
    }

    // 'O' states
    else if (state[0] === 'O') {
    if (state === 'OH') {
      const name = 'Ohio';
      return name;
    }
    else if (state === 'OK') {
      const name = 'Oklahoma';
      return name;
    }
    else if (state === 'OR') {
      const name = 'Oregon';
      return name;
    }
  }

  // Pennsylvania
  else if (state === 'PA') {
    const name = 'Pennsylvania';
    return name;
  }

  // Rhode Island
  else if (state === 'RI') {
    const name = 'Rhode Island';
    return name;
  }

  // 'S' states
  else if (state[0] === 'S') {
    if (state === 'SC') {
      const name = 'South Carolina';
      return name;
    }
    else if (state === 'SD') {
      const name = 'South Dakota';
      return name;
    }
  }

  // 'T' states
  else if (state[0] === 'T') {
    if (state === 'TN') {
      const name = 'Tennessee';
      return name;
    }
    else if (state === 'TX') {
      const name = 'Texas';
      return name;
    }
  }

  // Utah
  else if (state === 'UT') {
    const name = 'Utah';
    return name;
  }

  // 'V' states
  else if (state[0] === 'V') {
    if (state === 'VT') {
      const name = 'Vermont';
      return name;
    }
    else if (state === 'VA') {
      const name = 'Virginia';
      return name;
    }
  }

  // 'W' states
  else if (state[0] === 'W') {
    if (state === 'WA') {
      const name = 'Washington';
      return name;
    }
    else if (state === 'WV') {
      const name = 'West Virginia';
      return name;
    }
    else if (state === 'WI') {
      const name = 'Wisconsin';
      return name;
    }
    else if (state === 'WY') {
      const name = 'Wyoming';
      return name;
    }
  }

  // No Name
  else {
    console.log("ERROR: No name found for " + state);
    const name = state;
    return name;
  }
}