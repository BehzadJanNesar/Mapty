"use strict";

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

   _SetDiscription() {
      // prettier-ignore
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.discription = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
         months[this.date.getMonth()]
      }${this.date.getDate()}`;
   }
}

class Running extends Workout {
   type = "running";

   constructor(coords, distance, duration, cadence) {
      super(coords, distance, duration);
      this.cadence = cadence;
      this.calcPace();
      this._SetDiscription();
   }

   calcPace() {
      //calc as min/km
      this.pace = this.duration / this.distance;
      return this.pace;
   }
}
class Cycling extends Workout {
   type = "cycling";

   constructor(coords, distance, duration, elevationGain) {
      super(coords, distance, duration);
      this.elevationGain = elevationGain;
      this.calcSpeed();
      this._SetDiscription();
   }

   calcSpeed() {
      // calc as km/hour
      this.speed = this.distance / (this.duration / 60);
      return this.speed;
   }
}

/////////////////////////////////////////////////////////////////////////
class App {
   #map;
   #mapEvents;
   #workouts = [];
   // constructor section
   constructor() {
      this._getDataFromLocalStorage();
      this._getposition();
      form.addEventListener("submit", this._newWorkout.bind(this));
      inputType.addEventListener("change", this._toggleElevationField);
      containerWorkouts.addEventListener("click", this._MoveToPopup.bind(this));
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
      this.#workouts.forEach((item) => {
         this._renderWorkoutMarker(item);
      });
   }
   // show form box method
   _showForm(mapE) {
      this.#mapEvents = mapE;
      form.classList.remove("hidden");
      inputDistance.focus();
   }

   // hide form
   _hideForm() {
      inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
      form.style.display = "none";
      form.classList.add("hidden");
      setTimeout(() => (form.style.display = "grid"), 1000);
   }

   // toggle Elevation input value field
   _toggleElevationField() {
      inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
   }
   // add new workout method
   _newWorkout(e) {
      const validateInput = (...inputes) => inputes.every((inp) => Number.isFinite(inp));
      const positiveValue = (...values) => values.every((value) => value > 0);

      e.preventDefault();

      // get data from form
      const type = inputType.value,
         distance = +inputDistance.value,
         duration = +inputDuration.value,
         targetPosition = this.#mapEvents.latlng,
         { lat, lng } = targetPosition;

      let workout;

      // check validation of data

      // If workout is Running, create running object
      if (type === "running") {
         const cadence = +inputCadence.value;
         if (
            !validateInput(distance, duration, cadence) ||
            !positiveValue(distance, duration, cadence)
         )
            return alert("Inputs have to be positive number...");

         workout = new Running([lat, lng], distance, duration, cadence);
      }

      // If workout is Cycling, create running cycling
      if (type === "cycling") {
         const elevation = +inputElevation.value;
         if (!validateInput(distance, duration, elevation) || !positiveValue(distance, duration))
            return alert("Inputs have to be positive number...");

         workout = new Cycling([lat, lng], distance, duration, elevation);
      }

      // add new object to array
      this.#workouts.push(workout);
      // render workout on map as marker
      this._renderWorkout(workout);
      this._renderWorkoutMarker(workout);

      // hide form and clear inputs value
      this._hideForm();

      // set localStorage data
      this._setLocalStorageData();
   }
   _renderWorkoutMarker(workout) {
      L.marker(workout.coords)
         .addTo(this.#map)
         .bindPopup(
            workout.type === "running" ? `🏃‍♂️${workout.discription}` : `🚴‍♀️${workout.discription}`,
            {
               maxWidth: 250,
               minWidth: 110,
               autoClose: false,
               closeOnClick: false,
               className: `${workout.type}-popup`,
            }
         )
         .openPopup();
   }
   _renderWorkout(workout) {
      let html = `
         <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.discription}</h2>
            <div class="workout__details">
               <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
               <span class="workout__value">${workout.distance}</span>
               <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
               <span class="workout__icon">⏱</span>
               <span class="workout__value">${workout.duration}</span>
               <span class="workout__unit">min</span>
            </div>
      `;
      if (workout.type === "running") {
         html += `
            <div class="workout__details">
               <span class="workout__icon">⚡️</span>
               <span class="workout__value">${workout.pace.toFixed(1)}</span>
               <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
               <span class="workout__icon">🦶🏼</span>
               <span class="workout__value">${workout.cadence}</span>
               <span class="workout__unit">spm</span>
            </div>
         </li>
         `;
      }
      if (workout.type === "cycling") {
         html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
         `;
      }
      form.insertAdjacentHTML("afterend", html);
   }

   _MoveToPopup(e) {
      const workoutElemet = e.target.closest(".workout");
      if (!workoutElemet) return;

      const workout = this.#workouts.find((work) => work.id === workoutElemet.dataset.id);

      this.#map.setView(workout.coords, 13, {
         animate: true,
         pan: {
            duration: 1,
         },
      });
   }

   _setLocalStorageData() {
      localStorage.setItem("workouts", JSON.stringify(this.#workouts));
   }
   _getDataFromLocalStorage() {
      const data = JSON.parse(localStorage.getItem("workouts"));

      if (!data) return;

      this.#workouts = data;
      this.#workouts.forEach((item) => {
         this._renderWorkout(item);
      });
   }
}

const app = new App();
