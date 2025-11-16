//Nav-bar
const popuLink = document.getElementById("populares");
const estrenosLink = document.getElementById("estrenos");
const generoLink = document.getElementById("generos");
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