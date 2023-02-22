// Declaramos las const
const formulario = document.getElementById('ingreso-persona');
const botonEliminarTodasLasFilas = document.getElementById('deleteall');
const tabla = document.getElementById('tabla');
const botonRegistrar = document.getElementById('botonRegistrar');
const botonGuardarEdicion = document.getElementById('botonGuardarEdicion');
const personas = JSON.parse(localStorage.getItem('personas')) || [];
const fechaInput = document.getElementById('fechaIngreso');


// Bloque fechas

var ahora = new Date();

var dia = ("0" + ahora.getDate()).slice(-2);
var mes = ("0" + (ahora.getMonth() + 1)).slice(-2);

var hoy = ahora.getFullYear()+"-"+(mes)+"-"+(dia) ;

fechaInput.value = hoy;

// Bloque form y lista

botonGuardarEdicion.setAttribute('style', 'visibility:hidden !important;display:none !important');

const reiniciar_valores_radio = () => {
    let inputsRadio = document.getElementsByName("inlineRadioOptions");
    for (let i = 0; i < inputsRadio.length; i++) {
        if (inputsRadio[i].checked) {
            inputsRadio[i].checked = false;
        }
    }
}

//FUNCTION PARA LIMPIAR CAMPOS DESPUES DE CARGAR
function limpiarCampos() {
    formulario.nombre.value = "";
    formulario.edad.value = "";
    reiniciar_valores_radio();
    formulario.fechaIngreso.value = hoy;

};

// const para mostrar o ocultar lista
const listaEsVisible = () => {
    if (personas.length > 0) {
        tabla.setAttribute('style', 'visibility:visible !important')
    } else {
        tabla.setAttribute('style', 'visibility:hidden !important')        
    }
}
listaEsVisible();

// const para ocultar o mostrar botón que borra la lista
const botonBorradoListaEsVisible = () => {
    if (personas.length > 1) {
        botonEliminarTodasLasFilas.setAttribute('style', 'visibility:visible !important');
    } else {
        botonEliminarTodasLasFilas.setAttribute('style', 'visibility:hidden !important');     
    }
}
botonBorradoListaEsVisible();


//function para borrar tabla
function borrarTabla() {
        personas.length = 0;
        localStorage.clear();
        botonBorradoListaEsVisible();
        listaEsVisible();
        formulario.fechaIngreso.value = hoy;
}

// const para agregar fila nueva a la tabla
const mostrarPersonas = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = "";
    
    personas.forEach( p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.rol}</td>
            <td>${p.nombre}</td>
            <td>${p.edad}</td>
            <td>${p.fechaIngreso}</td>
            <td><button class="btn-edit btn btn-info" id="${p.nombre}">Editar</button>
            <button class="btn-delete btn btn-danger" id="${p.nombre}">Borrar</button></td>
        `;
        tableBody.appendChild(tr);
    })
    
    //BTN QUE SABE CUAL ES ID DEL ELEMENTO SELECCIONADO Y DISPARA LA EDICION
    const btnEdit = document.querySelectorAll('.btn-edit'); //NodeList = []
    btnEdit.forEach( btn => btn.addEventListener('click', editarRegistro));

    //CONST DE BTN QUE SABE CUAL ES EL ID DEL ELEMENTO SELECCIONADO Y DISPARA EL DELETE}
    const btnDelete = document.querySelectorAll('.btn-delete'); //NodeList = []
    btnDelete.forEach( btn => btn.addEventListener('click', borrarRegistroUI));
    listaEsVisible();
    botonBorradoListaEsVisible();
};

document.addEventListener('DOMContentLoaded', mostrarPersonas);

//EDICION REGISTRO UI
function editarRegistro(e){
    nombre = e.target.id;

    const personaEncontrada = personas.find( p => p.nombre === nombre);

    formulario.nombre.value = personaEncontrada.nombre;
    formulario.edad.value = personaEncontrada.edad;
    formulario.inlineRadioOptions.value = personaEncontrada.rol;
    formulario.fechaIngreso.value = personaEncontrada.fechaIngreso;


    botonRegistrar.setAttribute('style', 'visibility:hidden !important;display:none !important');
    botonGuardarEdicion.setAttribute('style', 'visibility:visible !important;display:block !important');
    
    botonGuardarEdicion.addEventListener('click', ()=> guardarRegistro(nombre));
}

//BORRADO REGISTRO UI
function borrarRegistroUI(e){
    nombre = e.target.id;

    const personaEncontradaBorrado = personas.find((elemento) => elemento.nombre === nombre);

    const indice = personas.indexOf(personaEncontradaBorrado);
    personas.splice(indice, 1);
    localStorage.setItem('personas', JSON.stringify(personas));

    mostrarPersonas();
}

//GUARDAR BORRADO REGISTRO UI
function guardarBorradoRegistro(nombre){
    personas.map( p => {
        if(p.nombre === nombre){
            personas.splice(p, 1)
        }
    })
    localStorage.setItem('personas', JSON.stringify(personas));
    mostrarPersonas();
}

//GUARDADO REGISTRO Y ACTUALIZACION STORAGE
function guardarRegistro(nombre){
    personas.map( p => {
        if(p.nombre === nombre){
            p.nombre = formulario.nombre.value;
            p.edad = formulario.edad.value;
            p.rol = formulario.inlineRadioOptions.value;
            p.fechaIngreso = formulario.fechaIngreso.value;
        }
    })
    localStorage.setItem('personas', JSON.stringify(personas));
    
    // TENGO QUE DEBUGGEAR EL PORQUE SE BUGGEA CUANDO ESTA FUNCION SE LLAMA
    // limpiarCampos();

    mostrarPersonas();
    botonRegistrar.setAttribute('style', 'visibility:visible !important;display:block !important');
    botonGuardarEdicion.setAttribute('style', 'visibility:hidden !important;display:none !important');

    if (guardarRegistro) {
        Swal.fire(
            'Bien hecho!',
            'Registro editado corréctamente',
            'success'
        )
    }
}


//FORMULARIO REGISTRO
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const persona = new Persona(formulario.inlineRadioOptions.value, formulario.nombre.value, formulario.edad.value, formulario.fechaIngreso.value);

    personas.push(persona);

    if (persona) {
        Swal.fire(
            'Bien hecho!',
            'Registro creado corréctamente',
            'success'
        )
    }

    localStorage.setItem('personas', JSON.stringify(personas));

    mostrarPersonas();
    botonBorradoListaEsVisible()
    listaEsVisible();
    limpiarCampos();
});

//BOTON ELIMINAR TODAS LAS FILAS
    botonEliminarTodasLasFilas.addEventListener('click', ()=> {
        borrarTabla();
        limpiarCampos();
});