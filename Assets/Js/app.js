//Nav-bar
const popuLink = document.getElementById("populares");
const estrenosLink = document.getElementById("estrenos");
const generoLink = document.getElementById("generos");
const dropdownContent = document.querySelector('.dropdown-content');
const listaLink = document.getElementById("lista");


//Btn y class
const btnExplorar = document.querySelector(".btn-explorar");
const btnAgregar = document.querySelectorAll(".btn-agregar");
const carouselContainer = document.querySelector(".carousel-container"); //=>Para usar con la API


//Form
const form = document.getElementById("form");
const nombre = document.getElementById("name");
const email = document.getElementById("email");
const mensaje = document.getElementById("message")


//################################################################# F  U N  C  I  O  N  E  S #################################################################\\

//==========================Funcion de manejo de errores============================\\

function setError(element, message) {
    const controlInput = element.parentElement;
    const small = controlInput.querySelector('.error-text');
    
    small.innerText = message;
    controlInput.classList.add('error');
    controlInput.classList.remove('success');
}

//================================= Función para mostrar éxito===========================\\
function setSuccess(element) {
    const controlInput = element.parentElement;
    const small = controlInput.querySelector('.error-text');
    
    small.innerText = '';
    controlInput.classList.remove('error');
    controlInput.classList.add('success');
}



//======================Api key y URL========================\\
const API_KEY = 'e37313cddebf7e2cb372e33b098690e6';
const API_URL = 'https://api.themoviedb.org/3/movie';





//==========  Funcion de mostrar peliculas en el carousel  ==========\\
function displayMovies(movies, isWatchlistView = false) { 
    carouselContainer.innerHTML = '';
    
    movies.forEach(movie => {
        let buttonText;
        
        if (isWatchlistView) {
            buttonText = 'Quitar de la Lista';
        } else {
            buttonText = isMovieInWatchlist(movie.id.toString()) 
                ? 'Quitar de la Lista' 
                : 'Agregar a Lista';
        }
        
        const movieHTML = `
        <div class="peli-carousel" data-movie-id="${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster de ${movie.title}">
        <div class="info-peli-text">
        <h3>${movie.title}</h3> 
        <p>${movie.overview.substring(0, 150)}...</p> 
        <button class="btn-agregar">${buttonText}</button>
                </div>
                </div>
                `;
                carouselContainer.innerHTML += movieHTML;
    });
}
        
        
        
//======================== Funcion de Busqueda de peliculas ========================\\
async function fetchMovies(path) { 
    let baseUrl= API_URL;
    let querySeparador = '?';
    if (path.startsWith('/discover')) {
        baseUrl = API_URL.replace('/movie', '');
    }

    if (path.includes('?')) {
        querySeparador = '&';
    }
    const url = `${baseUrl}${path}${querySeparador}api_key=${API_KEY}&language=es-ES`; 
    try {
        const resp = await fetch(url);
        if (!resp.ok) { 
                throw new Error(`Error HTTP: ${resp.status} al obtener ${path}`);
            }
            
            const data = await resp.json();
            displayMovies(data.results);
            
        } catch (error) {
            console.error("Fallo al cargar la API:", error);
        carouselContainer.innerHTML = `<div class="error-message"> No se pudieron cargar las películas. Intenta de nuevo.</div>`; 
    }
}


//========================== Funcion de busqueda de generos ============================\\
async function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;
    
    try{
        const resp = await fetch(url);
        if(!resp.ok){
            throw new Error(`Error HTTP: ${resp.status} al obtener géneros`);
        }
        
        const data = await resp.json();
        return data.genres;
    }catch(error){
        console.error("Fallo al cargar los géneros:", error);
        return [];
    }
}


//========================== Funcion de mostrar generos en el dropdown ============================\\
function displayGenres(genres) {
    dropdownContent.innerHTML = '';
    let generoHTML = '<ul class="tipos-generos"> ';
    genres.forEach(genre => {
        generoHTML += `<li>
                            <a href="#" class="genero-item" data-genre-id="${genre.id}">${genre.name}</a>
                        </li>
            `;
    });
    generoHTML += '</ul>';
    dropdownContent.innerHTML = generoHTML;
}


//========================== Funciones de Watchlist (LocalStorage) ============================\\
function getWatchlist() {
    const storedList = localStorage.getItem('movieWatchlist'); 
    if (storedList) {
        return JSON.parse(storedList); 
    } 
    return []; 
}

function saveWatchlist(list) {
    const listJSON = JSON.stringify(list); 
    localStorage.setItem('movieWatchlist', listJSON);
}



//========================== Función para añadir a la lista ============================\\
async function addToWatchlist(movieId) { 
    let watchlist = getWatchlist();
    const isMovieInList = watchlist.some(movie => movie.id.toString() === movieId);

    if (!isMovieInList) {
        const url = `${API_URL}/${movieId}?api_key=${API_KEY}&language=es-ES`;
        
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error('Error al obtener detalles de la película');

            const movieDetails = await resp.json();
            
            watchlist.push(movieDetails);
            saveWatchlist(watchlist);
            alert(`¡"${movieDetails.title}" ha sido añadida a tu lista!`);

        } catch (error) {
            console.error("Fallo al añadir a la lista:", error);
        }
    } else {
        alert("¡Esta película ya está en tu lista!");
    }
}


//========================== Función para mostrar la lista ============================\\
//========================== Función para mostrar la lista ============================\\
function showMyList() {
    const watchlist = getWatchlist(); 
    
    if (watchlist.length === 0) {
        carouselContainer.innerHTML = `<div class="error-message"> Tu lista está vacía. ¡Agrega algunas películas!</div>`;
    } else {
        displayMovies(watchlist, true); 
    }
}


//========================== Función para verificar si la película está en la lista ============================\\
function isMovieInWatchlist(movieId) {
    const watchlist = getWatchlist();
    
    // Uso .some() para verificar si AL MENOS UN objeto en el array
    return watchlist.some(movie => movie.id.toString() === movieId);
}

//========================== Función para quitar de la lista ============================\\
function removeFromWatchlist(movieId) {
    const watchlist = getWatchlist();
    
    const newWatchlist = watchlist.filter(movie => movie.id.toString() !== movieId);

    saveWatchlist(newWatchlist);
    
    alert('Película eliminada de tu lista.');
    
    if (typeof showMyList === 'function') {
        showMyList(); 
    }
}

//################################################################# F  I  N  -  F  U N  C  I  O  N  E  S #################################################################\\



//################################################################# E  V  E  N  T  O  S ###############################################################################\\

//==========================Eventos Nav-bar ============================\\

popuLink.addEventListener("click", (e)=>{
    e.preventDefault();
    fetchMovies("/popular");
})

estrenosLink.addEventListener("click", (e)=>{
    e.preventDefault();
    fetchMovies("/upcoming");
})

btnExplorar.addEventListener("click", (e)=>{
    e.preventDefault();
    fetchMovies("/popular");
})


//================ Evento para agregar O quitar de la lista =================\\
carouselContainer.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-agregar")) {
        e.preventDefault();
        
        const peliDiv = e.target.closest('.peli-carousel');
        const movieId = peliDiv.dataset.movieId; 

        if (e.target.innerText === 'Quitar de la Lista') {
            removeFromWatchlist(movieId); 
        } else {
            addToWatchlist(movieId);
        }
    }
});


//========================== Evento para Mi Lista ============================\\
listaLink.addEventListener("click", (e) => {
    e.preventDefault();
    showMyList();
});



//================ Dropdown generos ================\\
generoLink.addEventListener("click", (e)=>{
    e.preventDefault();
    fetchGenres().then(genres => {
        displayGenres(genres);
    });
    
    dropdownContent.classList.toggle("active-dropdown");
})


//================ Evento para seleccionar un genero =================\\
dropdownContent.addEventListener("click", (e)=>{
    if(e.target.classList.contains("genero-item")){
        e.preventDefault();
        const genreId = e.target.getAttribute("data-genre-id");
        fetchMovies(`/discover/movie?with_genres=${genreId}`);
        dropdownContent.classList.remove("active-dropdown");
    }
})







//============================== Eventos en el form ===============================\\

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    //Validacion
    const nombreValue = nombre.value.trim();
    const emailValue = email.value.trim();
    const mensajeValue = mensaje.value.trim();

    let isValid = true;

    if(nombreValue === ''){
        setError(nombre, 'El nombre es obligatorio');
        isValid = false;
    } else {
        setSuccess(nombre);
    }

    if(emailValue === ''){
        setError(email, 'El email es obligatorio');
        isValid = false;
    } else if(!/\S+@\S+\.\S+/.test(emailValue)){
        setError(email, 'El email no es válido');
        isValid = false;
    } else {
        setSuccess(email);
    }

    if(mensajeValue === ''){
        setError(mensaje, 'El mensaje es obligatorio');
        isValid = false;
    } else {
        setSuccess(mensaje);
    }

    if(isValid){
        console.log('Tu mensaje ha sido enviado correctamente');
        form.reset();
    }
})