let movieNameRef = document.getElementById("movies");
let movieListRef = document.getElementById("movie-list");
let list_result = document.getElementById("list-result");
let getTop50Movies = () => {
    let url = `http://www.omdbapi.com/?apikey=d36cc35e`;
    let allMovies = [];

    const fetchData = async (url) => {
        let resp = await fetch(url);
        let data = await resp.json();
        allMovies = allMovies.concat(data.Search);
        if (data.totalResults > allMovies.length) {
            let nextPage = Math.ceil(allMovies.length / 10) + 1;
            let nextUrl = `http://www.omdbapi.com/?apikey=d36cc35e`;
            await fetchData(nextUrl);
        }
    };
    fetchData(url).then(() => {
        allMovies.sort((a, b) => (a.imdbRating < b.imdbRating ? 1 : -1));
        let top50 = allMovies.slice(0, 50);
        let resultHTML = "";
        top50.forEach((data) => {
            resultHTML += `
        <div class="info">
        <h2>${data.Title}</h2>
        <div class="rating">
            <h4>${data.imdbRating}</h4>
        </div>
        <div class="details">
            <span>${data.Year}</span>
        </div>
          </div>
        `;
        });
        list_result.innerHTML = resultHTML;
    })
        .catch(() => {
            list_result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
        });

};
movieListRef.addEventListener("click", getTop50Movies);
window.addEventListener("load", getTop50Movies);
