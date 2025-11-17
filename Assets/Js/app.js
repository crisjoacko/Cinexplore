//Nav-bar
const popuLink = document.getElementById("populares");
const estrenosLink = document.getElementById("estrenos");
const generoLink = document.getElementById("generos");
const dropdownContent = document.querySelector('.dropdown-content');
const listaLink = document.getElementById("lista");
const contactoLink = document.getElementById("contacto");

//Btn y class
const btnExplorar = document.querySelector(".btn-explorar");
const btnAgregar = document.querySelectorAll(".btn-agregar");
const carouselContainer = document.querySelector(".carousel-container"); //=>Para usar con la API


//Form
const form = document.getElementById("form");
const nombre = document.getElementById("name");
const email = document.getElementById("email");
const mensaje = document.getElementById("message")




//Funcion de manejo de errores

function setError(element, message) {
    const controlInput = element.parentElement;
    const small = controlInput.querySelector('.error-text');
    
    small.innerText = message;
    controlInput.classList.add('error');
    controlInput.classList.remove('success');
}

// Función para mostrar éxito
function setSuccess(element) {
    const controlInput = element.parentElement;
    const small = controlInput.querySelector('.error-text');
    
    small.innerText = '';
    controlInput.classList.remove('error');
    controlInput.classList.add('success');
}



generoLink.addEventListener("click", (e)=>{
    e.preventDefault();
    
    dropdownContent.classList.toggle("active-dropdown");
})


//Api key
const API_KEY = 'e37313cddebf7e2cb372e33b098690e6';
const API_URL = 'https://api.themoviedb.org/3/movie';

//fetch()