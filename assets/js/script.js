// Referencias al DOM:
const formularioNE = document.getElementById('formularioNE');
const containerForm = document.getElementById("containerForm");
const cardContainer = document.getElementById("cardBox");
const modalInputs = Array.from(document.querySelectorAll(".modal-body input"));
let editingCard = null;
const entrada = [];

//Crear nueva entrada
function nuevaEntrada() {
    formularioNE.addEventListener('submit', (event) => {
        event.preventDefault();

        const linkPortada = document.getElementById('linkPortada').value;
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const sinopsis = document.getElementById('sinopsis').value;
        const aPublicacion = document.getElementById('aPublicacion').value;
        const fechaCompra = document.getElementById('fechaCompra').value;
        const numPaginas = parseInt(document.getElementById('numPaginas').value); // Asegúrate de que sea un número
        const pagLeidas = parseInt(document.getElementById('pagLeidas').value); // Asegúrate de que sea un número
        const calificacion = document.getElementById('calificacion').value;

        if (!linkPortada || !titulo || !autor || !numPaginas) {
            alert("Por favor, completa por lo menos la portada, titulo, autor, y páginas.");
            return;
        }

        // Calcula el progreso correctamente
        const progreso = Math.min(((pagLeidas / numPaginas) * 100).toFixed(2), 100);
        
        

        entrada.push({ linkPortada, titulo, autor, sinopsis, aPublicacion, fechaCompra, numPaginas, pagLeidas, progreso, calificacion });


        // Crea una nueva card para la última entrada
        createCard(entrada[entrada.length - 1]);

        // Restablece el formulario
        formularioNE.reset();

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        modal.hide();
    });
}

// Crear una nueva card
function createCard(entry) {
    const columna = document.createElement('div');
    columna.classList.add('column');
    cardBox.appendChild(columna);

    const card = document.createElement('div');
    card.classList.add('card');

    const cardContent = `
        <img src="${entry.linkPortada}" class="card-img-top" alt="${entry.titulo}">
        <div id="estrella">
            <label id="iconStar"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg></label>
            <p id="textoEstrella">${entry.calificacion}</p>
        </div>
        <div class="card-body">
            <h5 class="card-title">${entry.titulo}</h5>
            <p class="card-text">${entry.autor}</p>
            <div class="progress" role="progressbar" aria-valuenow="${entry.progreso}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${entry.progreso}%">${entry.progreso}%</div>
            </div>
            <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editableModal" onclick="editCard(${entrada.length - 1})">Ver más</a>  
        </div>
    `;
    card.innerHTML = cardContent;
    columna.appendChild(card);
}

// Función para editar la entrada y cargar los datos en el modal
// Editar la entrada en el modal
function editCard(index) {
    const card = entrada[index];

    // Llenar el formulario de edición con los valores actuales
    document.getElementById('editLinkPortada').value = card.linkPortada;
    document.getElementById('editTitulo').value = card.titulo;
    document.getElementById('editAutor').value = card.autor;
    document.getElementById('editSinopsis').value = card.sinopsis;
    document.getElementById('editAPublicacion').value = card.aPublicacion;
    document.getElementById('editFechaCompra').value = card.fechaCompra;
    document.getElementById('editNumPaginas').value = card.numPaginas;
    document.getElementById('editPagLeidas').value = card.pagLeidas;
    document.getElementById('editCalificacion').value = card.calificacion;

    if (!linkPortada || !titulo || !autor || !numPaginas) {
        alert("Por favor, completa por lo menos la portada, titulo, autor, y páginas.");
        return;
    }

    // Acción para eliminar la tarjeta
    const deleteButton = document.getElementById('deleteCardButton');
    deleteButton.onclick = function () {
        deleteCard(index);
    };

    // Manejar la acción de guardar cambios en el formulario de edición
    const formEdit = document.getElementById('formEditEntrada');
    formEdit.onsubmit = function (e) {
        e.preventDefault();

        // Obtener los valores editados
        const linkPortada = document.getElementById('editLinkPortada').value;
        const titulo = document.getElementById('editTitulo').value;
        const autor = document.getElementById('editAutor').value;
        const sinopsis = document.getElementById('editSinopsis').value;
        const aPublicacion = document.getElementById('editAPublicacion').value;
        const fechaCompra = document.getElementById('editFechaCompra').value;
        const numPaginas = parseInt(document.getElementById('editNumPaginas').value);
        const pagLeidas = parseInt(document.getElementById('editPagLeidas').value);
        const calificacion = document.getElementById('editCalificacion').value;

        // Recalcular el progreso con los valores editados
        const progreso = Math.min(((pagLeidas / numPaginas) * 100).toFixed(2), 100);

        // Actualizar la entrada en el array
        entrada[index] = { linkPortada, titulo, autor, sinopsis, aPublicacion, fechaCompra, numPaginas, pagLeidas, progreso, calificacion };

        // Actualizar la tarjeta visualmente
        updateCard(index);

        // Cerrar el modal después de guardar los cambios
        const modal = bootstrap.Modal.getInstance(document.getElementById('editableModal'));
        modal.hide();
    };
}


// Función para actualizar la tarjeta visualmente después de editarla
// Actualizar la tarjeta visualmente después de editar
function updateCard(index) {
    const card = entrada[index];
    const cardElement = cardBox.children[index];

    // Actualizar el contenido de la tarjeta
    cardElement.querySelector('.card-img-top').src = card.linkPortada;
    cardElement.querySelector('.card-title').textContent = card.titulo;
    cardElement.querySelector('.card-text').textContent = card.autor;

    // Actualizar la barra de progreso
    const progressBar = cardElement.querySelector('.progress-bar');
    progressBar.style.width = `${card.progreso}%`;
    progressBar.textContent = `${card.progreso}%`;

    // Actualizar la calificación
    cardElement.querySelector('#textoEstrella').textContent = card.calificacion;
}


// Función para eliminar una tarjeta
function deleteCard(index) {
    // Eliminar la entrada del arreglo
    entrada.splice(index, 1);

    // Eliminar el elemento de la tarjeta del DOM
    const cardToRemove = cardBox.children[index];
    cardBox.removeChild(cardToRemove);  // Eliminar solo esa tarjeta

    // Cerrar el modal de edición después de eliminar la tarjeta
    const modal = bootstrap.Modal.getInstance(document.getElementById('editableModal'));
    modal.hide();
}



// Inicializar evento de nueva entrada
nuevaEntrada();