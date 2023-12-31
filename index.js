const form = document.querySelector('form');
const searchInput = document.getElementById('search-input');
const searchResultEl = document.getElementById('search-results')
let myMovies = [];
const moviesFromLocalStorage = JSON.parse(localStorage.getItem('myMovies'));


// event listener for add buttons which adds movies to local storage //

document.addEventListener('click', e => {
    if(moviesFromLocalStorage) {
        myMovies = moviesFromLocalStorage;
    }
    if(e.target.dataset.add) {
        if(myMovies.includes(e.target.dataset.add)) {
            return;
        } else {
            myMovies.push(e.target.dataset.add);
        }
    }
    localStorage.setItem('myMovies', JSON.stringify(myMovies));
})


// Event Listener for the form submission which fetches nd displays the search results //

if(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        let titleString = searchInput.value;
        const searchRes = await fetch(`https://www.omdbapi.com/?apikey=8fbb0769&s=${titleString}&type=movie`);
        const searchResults = await searchRes.json();
        if(searchResults.Error) {
            renderErrorMessage();
        } else {
            const searchResultIds = await searchResults.Search.map(movie => movie.imdbID);
            const moviesData = await getMovieDataFromIds(searchResultIds);
            console.log(moviesData);
            renderMovieList(moviesData, searchResultEl, 'add', '+');
        }

        searchInput.value = '';

    });
}

// returns movie dates from imbd ids //

async function getMovieDataFromIds(movieIds) {
    const idRes = await Promise.all(
        movieIds.map(id => {
            return fetch(`https://www.omdbapi.com/?apikey=8fbb0769&i=${id}&plot=short`)
        })
    )
    const idResults = await Promise.all(
        idRes.map(movie => movie.json())
    )
    return idResults;
}



// Display movie list for either searchlist or watchlist //

function renderMovieList(movies, container, dataset, btnText) {
    container.innerHTML = '';
    movies.forEach(movie => {
        container.innerHTML += `
        <div class="movie flex">
            <img class="poster" src="${movie.Poster}"/>
            <div class="info flex">
                <div class="row flex">
                    <h3>${movie.Title}</h3>
                        <p>⭐ ${movie.imdbRating}</p>
                </div>

                <div class="row flex">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>                
                </div>
                
                <div class="row flex">
                    <p class="plot">${movie.Plot}</p>             
                </div>
            </div>

            <div class="watchlist-action">
                <button data-${dataset}="${movie.imdbID}" class="watchlist-btn">${btnText}</button>            
            </div>
        </div>
        `
    })
}

// Display error message if search results return nothing //

function renderErrorMessage() {
    searchResultEl.innerHTML = `
        <div class="empty-list-msg flex">
            <p>Unable to find the movie you are looking for. Please search again.</p>        
        </div>
    `
}

export { moviesFromLocalStorage, renderMovieList, getMovieDataFromIds };