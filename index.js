const form = document.getElementById('form');
const searchInput = document.getElementById('search-input');
const searchResultEl = document.getElementById('search-results')
let myMovies = [];
const moviesFromLocalStorage = JSON.parse(localStorage.getItem('myMovies'));


// Event Listener for the form submission which fetches nd displays the search results //

if(form) {
    form.addEventListener('submit', async function(e){
        e.preventDefault();
        let titleString = searchInput.value;
        const searchRes = await fetch(`http://www.omdbapi.com/?apikey=8fbb0769&=${titleString}&type=movie`);
        const searchResults = await searchRes.json();
        if(searchResults.Error) {
            renderErrorMessage();
        } else {
            const searchResultIds = await searchResults.Search.ma(movie => movie.imbdID);
            const moviesData = await getMovieDataFromIds(searchResultIds);
            console.log(moviesData);
            renderMovieList(moviesData, searchResultEl, 'add', '+');
        }

        searchInput.value = '';

    });
}

// returns movie dates from imbd ids //



// event listener for add buttons which adds movies to local storage //

document.addEventListener('click', e => {
    if(moviesFromLocalStorage) {
        myMovies = moviesFromLocalStorage;
    }
    if(e.target.dataset.add) {
        if(myMovies.includes(e.target.dataset.add)) {
            return;
        } else {
            myMovies.push(e.target.dataset.add)
        }
    }
    localStorage,setItem('myMovies', JSON.stringify(myMovies));
})



