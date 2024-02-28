"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
   date = new Date();
   id = (Date.now() + "").slice(-10);
   constructor(coords, distance, duration) {
      this.coords = coords;
      this.distance = distance;
      this.duration = duration;
   }
}

class Running extends Workout {
   constructor(coords, distance, duration, cadence) {
      super(coords, distance, duration);
      this.cadence = cadence;
      this.calcPace();
   }

   calcPace() {
      //calc as min/km
      this.pace = this.duration / this.distance;
      return this.pace;
   }
}
class Cycling extends Workout {
   constructor(coords, distance, duration, elevationGain) {
      super(coords, distance, duration);
      this.elevationGain = elevationGain;
      this.calcSpeed();
   }

   calcSpeed() {
      // calc as km/hour
      this.speed = this.distance / (this.duration / 60);
      return this.speed;
   }
}

const run1 = new Running();
const cycling1 = new Cycling();
console.log(run1, cycling1);

/////////////////////////////////////////////////////////////////////////
class App {
   #map;
   #mapEvents;
   // constructor section
   constructor() {
      this._getposition();
      form.addEventListener("submit", this._newWorkout.bind(this));
      inputType.addEventListener("change", this._toggleElevationField);
   }

   // start set methods

   // get map position methods
   _getposition() {
      if (navigator.geolocation)
         navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
            alert("could not get your position...");
         });
   }
   // load map method
   _loadMap(position) {
      const MyPosition = position.coords;
      const { latitude, longitude } = MyPosition;
      this.#map = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      L.marker([latitude, longitude])
         .addTo(this.#map)
         .bindPopup("This is your  Location...", {
            autoClose: false,
            closeOnClick: false,
            className: "running-popup",
         })
         .openPopup();

      this.#map.on("click", this._showForm.bind(this));
   }
   // show form box method
   _showForm(mapE) {
      this.#mapEvents = mapE;
      form.classList.remove("hidden");
      inputDistance.focus();
   }

   // toggle Elevation input value field
   _toggleElevationField() {
      inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
   }
   // add new workout method
   _newWorkout(e) {
      const validateInput = (...inputes) => {
         console.log(inputes);
      };
      validateInput("ali", "behzad", ":reza");

      e.preventDefault();

      // get data from form
      const type = inputType.value,
         distance = +inputDistance.value,
         duration = +inputDuration.value;

      // check validation of data

      // If workout is Running, create running object
      if (type === "running") {
         const cadence = +inputCadence.value;
         if (!Number.isFinite(cadence) || !Number.isFinite(distance) || !Number.isFinite(duration))
            return alert("Inputs have to be positive number...");
      }

      // If workout is Cycling, create running cycling
      if (type === "cycling") {
         const elevation = +inputElevation.value;
      }

      // add new object to array

      inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
      const targetPosition = this.#mapEvents.latlng;
      const { lat, lng } = targetPosition;
      L.marker([lat, lng])
         .addTo(this.#map)
         .bindPopup("Walker", {
            maxWidth: 250,
            minWidth: 110,
            autoClose: false,
            closeOnClick: false,
            className: "cycling-popup",
         })
         .openPopup();
   }
}

const app = new App();
