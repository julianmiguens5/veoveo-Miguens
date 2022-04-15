//Variables Globales

let i = 0;
let buscarpeli = '';

const listPeliculas = [];
const listUsuarios = [];
const objPeliculas = [];

//alert("Bienvenido al sistema de puntuación de peliculas de VeoVeo.LA. Ingresa 1 para buscar entre las películas cargadas. Ingrese 0 para salir.");

let consulta = true;

// RECUPERAMOS EL LOCAL STORAGE DEL USUARIO
document.addEventListener("DOMContentLoaded", function(event) {
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
let random = Math.floor(Math.random() * 63) + 1;

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

class Pelicula{
    
    // CREAMOS EL CONTRUCTOR
    constructor(nombre, genero, puntaje, plataforma){
        this.nombre = nombre;
        this.genero = genero;
        this.puntaje = parseInt(puntaje);
        this.plataforma = plataforma;
    }

}

class Usuario{
    
    // CREAMOS EL CONTRUCTOR
    constructor(nombre, apellido, edad, fechanac){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.fechanac = fechanac;
    }

}

// GUARDAMOS EL USUARIO
    let boton = document.getElementById("guardar");
    boton.addEventListener("click", (evento) => {
    evento.preventDefault();
    let nombre = document.querySelector("#nombre").value;
    if (nombre != ''){
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
} );


// VAMOS GUARDANDO EL RESUMEN DE LO CARGADO
function guardaPeli(pelicula,genero,puntaje,plataforma){
    i++;
    resumen = resumen.concat(pelicula +  ` es una pelicula del género de ${genero} tiene un puntaje de ${puntaje} y podes encontrarla en ${plataforma}. \n`);
    return resumen;
}

// 1 PARA BUSCAR ENTRE LAS PELICULAS CARGADAS Y 0 PARA SALIR DEL WHILE
while(consulta){
    if (pelicula == 0){
        consulta = false;
        document.getElementById("titulo").innerHTML = "<strong>Estos son las peliculas cargadas</strong>";
        console.log(`Has cargado el puntaje de ${i} peliculas`);
        break;
    } else if (pelicula == 1){
        buscarpeli = listPeliculas.filter((pelicula) => pelicula.nombre.includes(busqueda));
        break;
    } else { 
        listPeliculas.push(new Pelicula(pelicula, genero, puntaje, plataforma));
        const peli = {titulo: pelicula, genero: genero, puntuacion: puntaje, plataforma: plataforma};
        objPeliculas.push(peli);
        let resumen = guardaPeli(pelicula,genero,puntaje,plataforma);
        console.log(listPeliculas);
        console.log(objPeliculas);
        const para = document.createElement("li");
        const node = document.createTextNode(pelicula);
        para.appendChild(node);
        document.getElementById("listado").appendChild(para);
    }
}

document.write(`<p>${resumen}</p>`);

//VOLCAMOS AL HTML LA LISTA DE LAS PELIS CARGADAS
for (peli of listPeliculas) {
    document.write("<ul>");
    document.write(`<li style="list-style-type: none;"><strong>${peli.nombre}</strong> - ${peli.genero} - ${peli.puntaje} - ${peli.plataforma}</li>`);
    document.write("</ul>");
}

//VOLCAMOS AL HTML LA LISTA DE LO BUSCADO
if (buscarpeli != ''){
    for (buscada of buscarpeli) {
        document.write("Estas peliculas coinciden con el criterio de búsqueda");
        document.write("<ul>");
        document.write(`<li style="list-style-type: none;"><strong>${buscada.nombre}</strong> - ${buscada.genero} - ${buscada.puntaje} - ${buscada.plataforma}</li>`);
        document.write("</ul>");
    }
}

//CALCULAMOS EL PROMEDIO DE LAS PELICULAS CARGADAS POR MEDIO DE REDUCE

const total = listPeliculas.reduce((acumulador, elemento) => ({puntaje: acumulador.puntaje + elemento.puntaje}));
let promedio = total.puntaje/i;
document.write(`<p>El promedio de puntos de las peliculas cargadas es: ${promedio}</p>`);





