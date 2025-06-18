const modal = document.getElementById("modal");
const titulo = document.getElementById("modal-titulo");
const desc = document.getElementById("modal-desc");
const detalles = document.getElementById("modal-detalles");
const divisiones = document.getElementById("modal-divisiones");
const img = document.getElementById("modal-img");
const universeWrap = document.getElementById('universe-wrap');
const portalFondo = document.getElementById('portal-fondo');
const portalImg = document.getElementById('portal-img');
const portalTitulo = document.getElementById('portal-titulo');
const portalNiveles = document.getElementById('portal-niveles');
const portalInfo = document.getElementById('portal-info');
const portalExtra = document.getElementById('portal-extra');

function abrirModal(elo) {
    titulo.textContent = elo.nombre;
    desc.textContent = elo.descripcion;
    detalles.textContent = elo.detalles;
    divisiones.textContent = elo.divisiones;
    img.src = elo.icono;
    modal.style.display = "flex";
}

function cerrarModal() {
    modal.style.display = "none";
}

function mostrarPortal(rango) {
    portalImg.src = rango.img;
    portalTitulo.textContent = rango.titulo;
    portalNiveles.textContent = rango.niveles;
    portalInfo.textContent = rango.info;
    portalExtra.textContent = rango.extra || '';
    portalFondo.style.display = 'flex';
}

function cerrarPortal() {
    portalFondo.style.display = 'none';
}

function renderizarRangos(rangos) {
    universeWrap.innerHTML = '';
    rangos.forEach(rango => {
        const card = document.createElement('div');
        card.className = 'orbita-card';
        card.innerHTML = `
            <img src="${rango.img}" alt="${rango.titulo}">
            <h2>${rango.titulo}</h2>
            <p>${rango.info}</p>
        `;
        card.onclick = () => mostrarPortal(rango);
        universeWrap.appendChild(card);
    });
}

fetch('../data.json')
    .then(res => res.json())
    .then(data => renderizarRangos(data));

portalFondo.addEventListener('click', function(e) {
    if (e.target === portalFondo) cerrarPortal();
});