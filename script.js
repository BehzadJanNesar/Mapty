'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const MyPosition = position.coords;
      const { latitude, longitude } = MyPosition;
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

      var map = L.map('map').setView([latitude, longitude], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('This is your  Location...', {
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
        .openPopup();

      map.on('click', function (e) {
        form.classList.remove('hidden');

        // const targetPosition = e.latlng;
        // const { lat, lng } = targetPosition;

        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup('Walker', {
        //     maxWidth: 250,
        //     minWidth: 110,
        //     autoClose: false,
        //     closeOnClick: false,
        //     className: 'cycling-popup',
        //   })
        //   .openPopup();
      });
    },
    function () {
      alert('could not get your position...');
    }
  );
