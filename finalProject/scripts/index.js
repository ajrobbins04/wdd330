import { apiFetch } from './utils.mjs';

document.getElementById('search').className.replace('menu-link', 'active menu-link');



/*async function apiFetch()
{
const apiKey = 'dofSYJEmYCOaEjAr8dNzn9MdUkwJFbSHenA3X9Bv';
const url = `https://developer.nps.gov/api/v1/parks?`;

try {
   const response = await fetch(url, {
    method: 'GET',
    headers: {'X-Api-Key': apiKey}
  });
 
  if (response.ok) {
    const parkData = await response.json();
    console.log(parkData);
    //displayResults(parkData);
  } else {
      throw Error(await response.text());
  }

} catch (error) {
    console.log(error);
}

}*/
addEventListener('load', apiFetch);

