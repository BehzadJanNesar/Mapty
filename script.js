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

let map, mapEvents;
if (navigator.geolocation)
   navigator.geolocation.getCurrentPosition(
      function (position) {
         const MyPosition = position.coords;
         const { latitude, longitude } = MyPosition;
         console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

         map = L.map("map").setView([latitude, longitude], 13);

         L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         }).addTo(map);

         L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("This is your  Location...", {
               autoClose: false,
               closeOnClick: false,
               className: "running-popup",
            })
            .openPopup();

         map.on("click", function (mapE) {
            mapEvents = mapE;
            form.classList.remove("hidden");
            inputDistance.focus();
         });
      },
      function () {
         alert("could not get your position...");
      }
   );
// if (inputType)
form.addEventListener("submit", function (e) {
   e.preventDefault();
   inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
   const targetPosition = mapEvents.latlng;
   const { lat, lng } = targetPosition;
   L.marker([lat, lng])
      .addTo(map)
      .bindPopup("Walker", {
         maxWidth: 250,
         minWidth: 110,
         autoClose: false,
         closeOnClick: false,
         className: "cycling-popup",
      })
      .openPopup();
});

inputType.addEventListener("change", () => {
   inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
   inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
