// Function to check if value exists
function existsLocal(name) {
    let result;
    localStorage.getItem(name) === null ? result = false : result = true;
    return result;
}

// Function to put things in localStorage
function setLocal(name, value) {
    localStorage.setItem(name, value);
}

// Function to get things from localStorage
function getLocal(name) {
    return localStorage.getItem(name);
}

// Counter for clicks and profile
let profilecount;
let clickcount;
let map;

// function for getting new profiles
function getData() {
    return new Promise(
        function (resolve, reject) {
            fetch('https://randomuser.me/api/?results=10')
                .then(function (response) {
                    data = response.json();
                    resolve(data);
                }, error => reject(error));
        }
    )
}

// Create objects and drop into localstorage
function createProfiles() {
    // Returns the promise, creating the promise once doesn't work for re-use
    return new Promise(
        function (resolve, reject) {
            getData().then(response => {
                response.results.forEach((res, i) => {
                    let person = new Profile(res.name.first, res.dob.age, res.picture.large, res.location.street, res.location.city, res.location.coordinates.latitude, res.location.coordinates.longitude);
                    setLocal((i + profilecount), JSON.stringify(person));
                });
                resolve(null);

            }, error => reject(error));
        }
    )
}

// turn the users address into coordinates
function geoCode(string) {
    return new Promise(
        function (resolve, reject) {
            let query = encodeURI(string);
            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&access_token=pk.eyJ1Ijoidmwtd291dGVyIiwiYSI6ImNqbjMzZmF3aTAwYmMza29jd3M1NXkycnAifQ.rnu6svUUZZiURmBMZzIjAQ`
            fetch(url)
            .then(response => {
                data = response.json();
                resolve(data);
            }, error => reject(error));
        }
    );
}

/**
 * Calculate distance between user and profile
 * @param {*} key key to retrieve profile from localStorage
 */
function calcDistance(key, home) {
    let dest = JSON.parse(getLocal(key));
    let start = home;
    let dist = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [dest.coords.lng, dest.coords.lat],
                [start.lng, start.lat]
            ]
        }
    };
    let result = turf.length(dist);
    return result;
}

// Show profile on screen
function showProfile(key) {
    let profile = JSON.parse(getLocal(key));
    let home = JSON.parse(getLocal('coords_client'));
    geoCode(profile.address.addressString).then((data) => {
        profile.coords.lat = data.features[0].center[1];
        profile.coords.lng = data.features[0].center[0];
        setLocal(key, JSON.stringify(profile));
    }).then(() => {
        document.getElementById('profilearea').innerHTML = `
        <div class='profile__image'>
            <img src='${profile.photo}' alt='${profile.name}' class='picture__fill'>
        </div>
        <div class='profile__info'>
            <p class='profile__name bold'>${profile.name}</p> 
            <p class='profile__age'>${profile.age}</p>
        </div>
        <div class='profile__info'>
            <p class='profile__home'>${profile.address.city}</p>
            <p class='profile__dist'>${parseInt(calcDistance(key, home))}km</p>
        </div>
        `;
    });
}

// function to check click count, adds profiles when click count is at profile limit?
function checkClick() {
    if (clickcount > 8) {
        clickcount = 0;
        setLocal('clickcount', clickcount);
        createProfiles().then(() => {
            showProfile(profilecount);
            refreshList();
        });
    } else {
        clickcount++;
        setLocal('clickcount', clickcount);
        showProfile(profilecount);
        refreshList();
    }
}
// rewrite like and dislike to rate()
function rate(rating) {
    let current = JSON.parse(getLocal(profilecount));
    rating === 'like' ? current.liked = 1 : current.liked = -1;
    setLocal(profilecount, JSON.stringify(current));
    let layer = map.getLayer(`location${profilecount}`);
    if(typeof layer !== 'undefined') {
        map.removeLayer(`location${profilecount}`);
    }
    profilecount++;
    setLocal('profilecount', profilecount);
    checkClick();
    let home = JSON.parse(getLocal('coords_client'));
    map.flyTo({
        center: [home.lng, home.lat],
        zoom: 9
    });
}

// function to get users location
function getLocation() {
    return new Promise(
        (resolve, reject) => {
            let coords = {lat: 0, lng: 0};
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    coords.lat = position.coords.latitude;
                    coords.lng = position.coords.longitude;
                    resolve(coords);
                }, )
                
            }
            (error) => reject(error);
        }
    )
}

// initialize map
function initMap(lat, lng) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoidmwtd291dGVyIiwiYSI6ImNqbjMzZmF3aTAwYmMza29jd3M1NXkycnAifQ.rnu6svUUZZiURmBMZzIjAQ';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
        center: [lng, lat]
    });
    
}

// move to show profile area
function flyMap(id) {
    let dest = JSON.parse(getLocal(id));
    map.flyTo({
        center: [dest.coords.lng, dest.coords.lat],
        zoom: 10
    });
    let mapid = 'location' + id;
    let color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
    map.addLayer({
        'id': mapid,
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [dest.coords.lng, dest.coords.lat],
                }
            },
        },
        'paint': {
            'circle-color': color,
            'circle-radius': {
                'base': 10,
                'stops': [[9, 35], [12, 40], [22, 180]]
            },
            'circle-opacity': 0.5
        }
    });
}

// Check if coordinates exist in localstorage
if(existsLocal('coords_client')) {
    let coords = JSON.parse(getLocal('coords_client'));
    initMap(coords.lat, coords.lng);
} else {
    getLocation().then((coords) => {
        setLocal('coords_client', JSON.stringify(coords));
        initMap(coords.lat, coords.lng);
    })
    // initMap(coords.lat, coords.lng);
}


// Check if profilecount exists in localstorage
// if it doesn't, initialize it
if (existsLocal('profilecount')) {
    profilecount = parseInt(getLocal('profilecount'));
    showProfile(profilecount);
    refreshList();
} else {
    profilecount = 0;
    createProfiles().then(() => {
        showProfile(profilecount);
        refreshList();
    });
}

// Check if clickcount exists in localstorage
// if it doesn't, initialize it
existsLocal('clickcount') ? clickcount = parseInt(getLocal('clickcount')) : clickcount = 0;

// Function to toggle hidden elements
function toggleHide(element) {
    document.getElementById(element).classList.toggle('hidden');
}

//function to populate lists
function refreshList() {
    document.getElementById('likeList').innerHTML = '';
    document.getElementById('dislikeList').innerHTML = '';
    for (let i = 0; i < profilecount; i++) {
        let profile = JSON.parse(getLocal(i));
        if (profile.liked === 1) {
            document.getElementById('likeList').innerHTML += `
            <div class='list__item'>
                <img src='${profile.photo}' alt='${profile.name}' class='list__img'>
                <p class='list__name'>${profile.name}</p>
                <button type='button' class='btn btn__round--small btn__change btn--red' id='change_${i}'><i class="fas fa-times"></i></button> 
            </div>
            `;
        } else {
            document.getElementById('dislikeList').innerHTML += `
            <div class='list__item'>
                <img src='${profile.photo}' alt='${profile.name}' class='list__img'>
                <p class='list__name'>${profile.name}</p>
                <button type='button' class='btn btn__round--small btn__change btn--green' id='change_${i}'><i class="fas fa-heart"></i></button> 
            </div>
            `;
        }
    }
    let buttons = document.getElementsByClassName('btn__change');
    for (let i = 0; i < buttons.length; i++) {
        let id = buttons[i].id.split('_')[1];
        // console.log(id);
        buttons[i].addEventListener('click', () => changeMyMind(id));
    }
}

// function to change your mind
function changeMyMind(id) {
    let changing = JSON.parse(getLocal(id));
    changing.liked == 1 ? changing.liked = -1 : changing.liked = 1;
    setLocal(id, JSON.stringify(changing));
    refreshList();
}


// Add Event listeners to the like and dislike buttons
document.getElementById('like').addEventListener('click', function () {
    rate('like')
});
document.getElementById('dislike').addEventListener('click', function () {
    rate('dislike')
});
document.getElementById('showList').addEventListener('click', function () {
    toggleHide('list')
});
document.getElementById('hideList').addEventListener('click', () => toggleHide('list'));
document.getElementById('showmap').addEventListener('click', () => flyMap(profilecount));