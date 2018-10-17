// Class for profile objects
class Profile {
    constructor(name, age, photo, street, city, lat, lng) {
        this.name = name;
        this.age = age;
        this.photo = photo;
        this.address = new Address(street, city);
        this.coords = new Coords(lat, lng)
        this.liked = 0;
    }
}

class Address {
    constructor(street, city) {
        this.street = street;
        this.city = city;
        this.addressString = `${street}, ${city}`;
    }
}

class Coords {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }
}