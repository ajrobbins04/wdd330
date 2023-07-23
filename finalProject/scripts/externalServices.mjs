const baseURL = `https://developer.nps.gov/api/v1/`;
const apiKey = 'dofSYJEmYCOaEjAr8dNzn9MdUkwJFbSHenA3X9Bv';

async function convertToJson(res) {
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw { name: "servicesError", message: data };
    }
}

export async function apiFetch() {
  
    const url = `https://developer.nps.gov/api/v1/parks?`;

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

export async function findByParkCode(path, value) {

    try {
      const response = 
      await fetch(baseURL + `${path}parkCode=${value}`, {
        method: 'GET',
        headers: {'X-Api-Key': apiKey}
    });

    if (response.ok) {
      const park = await response.json();
      return park;
    } else {
      throw Error(await response.text());
    } 

  } catch (error) {
    console.log(error);
}
}

export async function findByStateCode(path, value) {

  try {
    const response = 
    await fetch(baseURL + `${path}stateCode=${value}`, {
      method: 'GET',
      headers: {'X-Api-Key': apiKey}
  });

  if (response.ok) {
    const parks = await response.json();
    return parks;
  } else {
    throw Error(await response.text());
  } 

} catch (error) {
  console.log(error);
}
}
