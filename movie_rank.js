const listEl = document.querySelector('li');
let pageNumber = 1;
const perPage = 5;
let currentData = [];
fetch('./latest_watch.json')
    .then(res => res.json())
    .then(data => {
        currentData = data.filter(item => item.type === 'movie');
        renderList(currentData, pageNumber, perPage);
    });

function renderList(data, pageNumber, perPage) {
    listEl.innerHTML = '';
    data.sort((a, b) => b.my_rate - a.my_rate);
    const startIndex = (pageNumber - 1) * perPage;
    const endIndex = startIndex + perPage;
    const filteredData = data.slice(startIndex, endIndex);
    filteredData.forEach(post => {
        listEl.insertAdjacentHTML('beforeend', `
<div class="watch-container">
<li>
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
}