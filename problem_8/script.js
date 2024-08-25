const apiKey = 'YOUR_OMDB_API_KEY'; // Replace with your OMDB API key
const searchBox = document.getElementById('searchBox');
const movieList = document.getElementById('movieList');
const movieDetails = document.getElementById('movieDetails');

let throttleTimeout;

// Throttle function
function throttle(func, limit) {
    return function(...args) {
        if (!throttleTimeout) {
            func(...args);
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;
            }, limit);
        }
    };
}

// Fetch movies from OMDB API
async function fetchMovies(query) {
    if (!query) return;
    
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovieTitles(data.Search);
        } else {
            movieList.innerHTML = '<p>No results found</p>';
            movieDetails.innerHTML = '';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display movie titles in a list
function displayMovieTitles(movies) {
    movieList.innerHTML = movies.map(movie => `
        <div class="movie-item" data-id="${movie.imdbID}">
            ${movie.Title} (${movie.Year})
        </div>
    `).join('');
}

// Fetch and display movie details
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            movieDetails.innerHTML = `
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Plot:</strong> ${data.Plot}</p>
                <img src="${data.Poster}" alt="${data.Title}" style="max-width: 100%;">
            `;
        } else {
            movieDetails.innerHTML = '<p>Details not found</p>';
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

// Event listener for search input
searchBox.addEventListener('input', throttle(function() {
    fetchMovies(searchBox.value);
}, 1000)); // Adjust the throttle limit as needed

// Event listener for movie list click
movieList.addEventListener('click', function(event) {
    const movieItem = event.target;
    if (movieItem.classList.contains('movie-item')) {
        fetchMovieDetails(movieItem.getAttribute('data-id'));
    }
});
