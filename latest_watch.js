const listEl = document.querySelector('li');
let pageNumber = 1;
const perPage = 4;
let currentData = [];
init();
function init() {
  // check if there is any movie data stored in Local Storage
  const storedData = localStorage.getItem('movieData');
  if (storedData) {
    currentData = JSON.parse(storedData);
  }
  fetch('./latest_watch.json')
    .then(res => res.json())
    .then(data => {
      // use the stored movie data if available, otherwise use the fetched data
      if (currentData.length === 0) {
        currentData = data;
      }
      renderList(currentData, pageNumber, perPage);
    }).then(() => {
      // save data to latest_watch.json
      fetch('./latest_watch.json', {
        method: 'PUT', // you can also use POST instead
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentData)
      })
    });
  }

function renderList(data, pageNumber, perPage) {
  listEl.innerHTML = '';
  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;
  const filteredData = data.sort((a, b) => new Date(b.watch_date) - new Date(a.watch_date)).slice(startIndex, endIndex);
  filteredData.forEach(post => {
    listEl.insertAdjacentHTML('beforeend', `
        <div class="watch-container-latest">
          <li data-id="${post.imdb_id}">
          <button class="delete-btn">X</button>
            <div class="info">
              <img src=${post.img_link} class="rank-img">
            </div>
            <div class="details">
              <h4>${post.name}</h4>
            </div>
            <div class="rating">
              <h5>${post.director_name}</h5>
              <h5>${post.imdb_rate}</h5>
            </div>
            <div class="details">
              <h5>${post.year}</h5>
              <h5>${post.genre}</h5>
            </div>
            <div class="details">
              <h4>Watch Date: ${post.watch_date}</h4>
            </div>
            <div class="details">
              <h4>My Rate: ${post.my_rate}</h4>
            </div>
          </li>
        </div>
      `);
  });

  renderPagination(data, pageNumber, perPage);
  const deleteBtns = document.querySelectorAll('.delete-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      const imdbId = listItem.getAttribute('data-id');
      const confirmed = confirm('Are you sure you want to delete this movie?');

      if (confirmed) {
        const index = currentData.findIndex(item => item.imdb_id === imdbId);
        currentData.splice(index, 1);
        localStorage.setItem('movieData', JSON.stringify(currentData));
        renderList(currentData, pageNumber, perPage);
      }
    });
  });
}
function renderPagination(data, pageNumber, perPage) {
  const paginationEl = document.querySelector('.pagination');
  paginationEl.innerHTML = '';

  const pageCount = Math.ceil(data.length / perPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.classList.add('pagination-btn');

    if (i === pageNumber) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      pageNumber = i;
      renderList(data, pageNumber, perPage);
      renderPagination(data, pageNumber, perPage);
    });

    paginationEl.appendChild(btn);
  }
  localStorage.setItem('movieData', JSON.stringify(data));
}
const movieTitleInput = document.getElementById("movie-title");
const imdbIdInput = document.getElementById("imdb-id");
const posterUrlInput = document.getElementById("poster-url");
const myRateInput = document.getElementById("my-rate");
const watchDateInput = document.getElementById("watch-date");
const directorNameInput = document.getElementById("director-name");
const imdbRateInput = document.getElementById("imdb-rate");
const genreInput = document.getElementById("genre");
const yearInput = document.getElementById("year");
const typeInput = document.getElementById("type");

movieTitleInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const title = movieTitleInput.value.trim().replace(/\s+/g, "+");
    fetchMovieDataByTitle(title);
  }
});

function fetchMovieDataByTitle(title) {
  const apiKey = 'd36cc35e';
  const url = `https://www.omdbapi.com/?t=${title}&plot=full&apikey=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      //movie exists in database
      if (data.Response == "True") {
        imdbIdInput.value = data.imdbID;
        posterUrlInput.value = data.Poster;
        directorNameInput.value = data.Director;
        imdbRateInput.value = data.imdbRating;
        genreInput.value = data.Genre;
        yearInput.value= data.Year;
        typeInput.value = "";
        myRateInput.value = "";
        watchDateInput.value = "";
      }
      //movie does NOT exists in database
      else {
        imdbIdInput.value = "";
        posterUrlInput.value = "";
        myRateInput.value = "";
        watchDateInput.value = "";
        directorNameInput.value = "";
        imdbRateInput.value = "";
        typeInput.value = "";
        genreInput.value = "";
        yearInput.value = "";
      }
    })
    .catch(error => console.log(error));
}
const formEl = document.querySelector('#add-movie-form');

formEl.addEventListener('submit', (event) => {
  event.preventDefault();

  const movieTitle = document.querySelector('#movie-title').value;
  const imdbId = document.querySelector('#imdb-id').value.trim();
  const posterUrl = document.querySelector('#poster-url').value;
  const myRate = document.querySelector('#my-rate').value;
  const watchDate = document.querySelector('#watch-date').value;
  const directorName = document.querySelector('#director-name').value;
  const imdbRate = document.querySelector('#imdb-rate').value;
  const genre = document.querySelector('#genre').value;
  const year = document.querySelector('#year').value;
  const type = document.querySelector('#type').value; // use yearInput.value instead of releaseYear
  const movieData = {
    name: movieTitle,
    imdb_id: imdbId,
    img_link: posterUrl,
    director_name: directorName,
    imdb_rate: imdbRate,
    genre: genre,
    year: year,
    my_rate: myRate,
    watch_date: watchDate,
    type:type,
  };


  currentData.unshift(movieData); // add new movie data to the beginning of the array
  renderList(currentData, pageNumber, perPage); // re-render the list with the updated data
});

