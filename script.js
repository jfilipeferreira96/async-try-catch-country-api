'use strict';

const btnCountry = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.country-container');
const input = document.querySelector('.country-input');

const renderCountry = function(data){

    const html = ` 
            <div class="country ${data.name.common}">
                <img class="country-img" src="${data.flags.svg}"/>
                <div class="text-start country-card">
                    <h3 class="country-name">${data.name.common}</h3>
                    <h4 class="country-region">${data.region}</h4>
                    <p class="country-row "><span class="fw-bold">Population:</span>${(data.population / 1000000).toFixed(1)} M</p>
                    <p class="country-row "><span class="fw-bold">Languages:</span>${Object.values(data.languages)[0]}</p>
                    <p class="country-row "><span class="fw-bold">Currency:</span>${Object.values(data.currencies)[0].name}</p>
                </div>
            </div>`;
    
    countriesContainer.insertAdjacentHTML('beforeend',html);
    countriesContainer.style.opacity = 1;
}

const renderError = function(msg){
    console.log(msg);
    countriesContainer.insertAdjacentText('beforeend',msg);
    countriesContainer.style.opacity = 1;
}

//  ######### ASYNC / AWAIT ###########

//metodo para conseguir a posicao atual
const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

//Utilizando Geolocation 
const whereAmIGeo = async function(){
    try{
    const position = await getPosition();
    const {latitude: lat, longitude: lng } = position.coords;
    
    const geoCode = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!geoCode.ok) throw new Error('There was a problem getting your current location! Please try again.');
    const dataGeo = await geoCode.json();
    
    //Country data
    const res = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`);
    if (!res.ok) throw new Error('There was a problem getting the country data!');
    const data = await res.json();
    
    renderCountry(data[0]);
    }catch(err){
        console.log(err);
        renderError(`${err.message}`);
    }
}

const whereAmIWritten = async function(country){
    try{
    //Country data
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error('There was a problem getting the country data!');
    const data = await res.json();

    console.log(data);

    renderCountry(data[0]);

    }catch(err){
        console.log(err);
        renderError(`${err.message}`);
    }
}

btnCountry.addEventListener('click', function (e) {
    e.preventDefault();

    countriesContainer.innerHTML = '';
    whereAmIGeo();
});

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      countriesContainer.innerHTML = '';
      whereAmIWritten(input.value);
    }
});
