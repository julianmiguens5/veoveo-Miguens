//Variables Globales

let i = 0;
let buscarpeli = '';

const listPeliculas = [];
const listUsuarios = [];
const objPeliculas = [];
const listaPelis = [];

//alert("Bienvenido al sistema de puntuación de peliculas de VeoVeo.LA. Ingresa 1 para buscar entre las películas cargadas. Ingrese 0 para salir.");

let consulta = true;

// RECUPERAMOS EL LOCAL STORAGE DEL USUARIO
document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault();
    let nombreguardado = localStorage.getItem('nombre');
    let apellidoguardado = localStorage.getItem('apellido');
    document.querySelector("#usuario").innerHTML = `<li class="nav-item"><p class="nav-link">Hola ${nombreguardado} ${apellidoguardado}</p></li>`;
});

// FETCH - CONEXION A API DE PELICULAS

const lista = document.querySelector('#listado');

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
        'X-RapidAPI-Key': '3588e5cf3emsh5b93a4a4d65ee7fp13d040jsnb1de369b0de2'
    }
};

// BUSCAMOS UN NÚMERO ALEATORIO
let random = Math.floor(Math.random() * 50) + 1;

async function fetchData() {
    const response = await fetch(`https://streaming-availability.p.rapidapi.com/search/basic?country=ar&service=netflix&type=movie&genre=18&page=${random}&output_language=es&language=en`, options)
    const json = await response.json();
    Array.from(json.results).forEach((post) => {
        const li = document.createElement('li');
        li.innerHTML = `<h3>${post.title}</h3><img src=${post.posterURLs[342]}>`;
        lista.append(li);
    })
    console.log(json);
    return json;
}

let data = fetchData();

class Pelicula {

    // CREAMOS EL CONTRUCTOR PARA LAS PELICULAS PREFERIDAS
    constructor(nombre, puntaje, plataforma) {
        this.nombre = nombre;
        this.puntaje = parseInt(puntaje);
        this.plataforma = plataforma;
    }

}

class Usuario {

    // CREAMOS EL CONTRUCTOR PARA LOS USUARIOS
    constructor(nombre, apellido, edad, fechanac) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.fechanac = fechanac;
    }

}

// GUARDAMOS EL USUARIO

if (window.location.href.indexOf("newsletter") > -1) {
    let boton = document.getElementById("guardar");
    boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        let nombre = document.querySelector("#nombre").value;
        if (nombre != '') {
            let apellido = document.querySelector("#apellido").value;
            let edad = document.querySelector("#edad").value;
            let fechanac = document.querySelector("#fechanac").value;
            document.querySelector(".mensaje").innerHTML = `<div class="alert alert-success" role="alert"> ${nombre} felitaciones! Vas a recibir las última novedades en peliculas y series.</div>`;
            listUsuarios.push(new Usuario(nombre, apellido, edad, fechanac));
            console.log(listUsuarios);
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('apellido', apellido);
            Swal.fire({
                icon: 'success',
                title: 'Felitaciones!',
                text: `${nombre} felitaciones!`
            });
        } else {
            document.querySelector(".mensaje").innerHTML = `<div class="alert alert-danger" role="alert">Por favor, completa los datos</div>`;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, completa los datos'
            });
        }
    });
}

// VAMOS GUARDANDO EL RESUMEN DE LO CARGADO
function guardaPeli(pelicula, puntaje, plataforma) {
    i++;
    resumen = resumen.concat(pelicula + ` tiene un puntaje de ${puntaje} y podes encontrarla en ${plataforma}. \n`);
    return resumen;
}

// GUARDAMOS LAS PELICULAS PREFERIDAS DEL USUARIO

let botonpeli = document.getElementById("guardarPeli");
botonpeli.addEventListener("click", (evento) => {
    evento.preventDefault();
    let nombrepeli = document.querySelector("#nombrepeli").value;
    if (nombrepeli != '') {
        let puntaje = document.querySelector("#puntaje").value;
        let plataforma = document.querySelector("#plataforma").value;
        document.querySelector(".mensajePeli").innerHTML += `<li> ${nombrepeli} tiene un puntaje de ${puntaje} y podes encontrarla en ${plataforma}. </li>`;
        listaPelis.push(new Pelicula(nombrepeli, puntaje, plataforma));
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, completa los datos'
        });
    }
    let count = 0;
    for (peli of listaPelis) {
        if (peli.nombre == nombrepeli) {
            count++;
            if (count > 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya cargaste esa pelicula'
                });
                listaPelis.pop();
            }
        }
        calculoPromedio();
    }
});

//CALCULAMOS EL PROMEDIO DE LAS PELICULAS CARGADAS POR MEDIO DE REDUCE

function calculoPromedio(){
    const total = listaPelis.reduce((acumulador, elemento) => ({
        puntaje: acumulador.puntaje + elemento.puntaje
    }));
    let length = listaPelis.length; 
    let promedio = total.puntaje / length;
    document.querySelector(".promedio").innerHTML = `<h4>El promedio de las peliculas cargadas es ${promedio}</h4>`;
}
