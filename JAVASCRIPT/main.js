const container = document.querySelector('.lol-campeones-container');
let todosCampeones = [];

const modal = document.createElement('div');
modal.id = 'lol-campeones-modal';
modal.style = `
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
modal.innerHTML = `
  <div style="
    display: flex;
    width: 90%;
    max-height: 85%;
    background: #0b0b0b;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px #000;
    position: relative;
    color: #F5DEB3;
    font-family: Garamond, serif;
  ">
    <span id="close-modal" style="
      position: absolute;
      top: 10px; right: 20px;
      font-size: 32px;
      color: #fff;
      cursor: pointer;
    ">&times;</span>

    <div style="flex: 0 0 50%;">
      <img id="modal-image" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

    <div style="
      flex: 1;
      padding: 40px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    ">
      <h2 id="modal-name" style="margin: 0 0 20px; font-size: 40px;"></h2>
      <div id="modal-abilities" style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;"></div>
      <p id="modal-lore" style="font-size: 22px; line-height: 1.6; max-width: 700px;"></p>
    </div>
  </div>
`;
document.body.appendChild(modal);


const modalImg = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalAbilities = document.getElementById('modal-abilities');
const modalLore = document.getElementById('modal-lore');
const closeModal = document.getElementById('close-modal');


function renderizarCampeones(campeones) {
    container.innerHTML = '';

    campeones.forEach(campeon => {
        const card = document.createElement('div');
        card.className = 'lol-campeones-card';
        card.dataset.tipos = campeon.tags.join(',');
        card.innerHTML = `
            <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeon.id}_0.jpg" alt="${campeon.name}">
            <div class="lol-campeones-name">${campeon.name}</div>
        `;
        container.appendChild(card);

        card.onclick = async () => {
            const version = '14.11.1';
            const res2 = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion/${campeon.id}.json`);
            const champ = (await res2.json()).data[campeon.id];

            modalImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeon.id}_0.jpg`;
            modalName.textContent = champ.name;
            modalLore.textContent = champ.lore;

            modalAbilities.innerHTML = `
                <div style="text-align:center;">
                    <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champ.passive.image.full}" 
                         title="Pasiva: ${champ.passive.name}"
                         style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #F5DEB3;" />
                    <div style="font-size:16px; margin-top:6px;">${champ.passive.name}</div>
                </div>
                ` + champ.spells.map(spell => `
                <div style="text-align:center;">
                    <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}" 
                         title="${spell.name}"
                         style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #F5DEB3;" />
                    <div style="font-size:16px; margin-top:6px;">${spell.name}</div>
                </div>
                `).join('');

            modal.style.display = 'flex';
        };
    });
}


// Función para filtrar campeones
function filtrarCampeones(tipo) {
    if (tipo === 'all') {
        renderizarCampeones(todosCampeones);
        return;
    }

    const filtrados = todosCampeones.filter(campeon =>
        campeon.tags.includes(tipo)
    );
    renderizarCampeones(filtrados);
}


document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filtrarCampeones(btn.dataset.tipo);
    });
});

// Cargar campeones desde la API
async function cargarCampeones() {
    const version = '14.11.1';
    const apiURL = `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`;

    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        todosCampeones = Object.values(data.data).map(campeon => ({
            ...campeon,
            tags: campeon.tags || []
        }));

        renderizarCampeones(todosCampeones);
    } catch (e) {
        console.error('Error al cargar campeones:', e);
        container.innerHTML = '<p class="error">Error al cargar los campeones. Intenta nuevamente más tarde.</p>';
    }
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

cargarCampeones();


const galaxiasDeModos = [
    {
        queueId: 420,
        modo: "Clasificatoria Solo/Dúo",
        mapa: "Grieta del Invocador",
        descripcion: "Competitiva individual o en pareja.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg",
        extra: "Usualmente jugado por jugadores que quieren subir de rango."
    },
    {
        queueId: 440,
        modo: "Clasificatoria Flexible",
        mapa: "Grieta del Invocador",
        descripcion: "Clasificatoria por equipos.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
        extra: "Ideal para equipos premade de 3 o 5 personas."
    },
    {
        queueId: 430,
        modo: "Normal - Selección Oculta",
        mapa: "Grieta del Invocador",
        descripcion: "Partida casual sin bans ni selección visible.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ashe_0.jpg",
        extra: "Perfecto para jugar sin presión."
    },
    {
        queueId: 450,
        modo: "ARAM",
        mapa: "Abismo de los Lamentos",
        descripcion: "Todos contra todos en un solo carril.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sona_0.jpg",
        extra: "Campeones aleatorios, acción constante."
    },
    {
        queueId: 900,
        modo: "URF",
        mapa: "Grieta del Invocador",
        descripcion: "Enfriamientos reducidos, maná infinito.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg",
        extra: "Solo por tiempo limitado. Muy caótico."
    },
    {
        queueId: 1020,
        modo: "Uno para Todos",
        mapa: "Grieta del Invocador",
        descripcion: "Todos los jugadores usan el mismo campeón.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg",
        extra: "Diversión asegurada (o caos total con Teemo)."
    },
    {
        queueId: 1100,
        modo: "TFT Normal",
        mapa: "Convergencia",
        descripcion: "Juego de estrategia por turnos.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MissFortune_31.jpg",
        extra: "Combina unidades, administra economía."
    },
    {
        queueId: 1130,
        modo: "TFT Clasificatoria",
        mapa: "Convergencia",
        descripcion: "TFT competitivo con clasificación.",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MissFortune_31.jpg",
        extra: "Misma jugabilidad que el modo normal, pero con sistema de rango."
    }
];

const naveTarjetas = document.getElementById("universo-tarjetas");
const portalGalactico = document.getElementById("portal-galactico");
const tituloPortal = document.getElementById("titulo-portal");
const imagenPortal = document.getElementById("imagen-portal");
const mapaPortal = document.getElementById("mapa-portal");
const descripcionPortal = document.getElementById("descripcion-portal");
const extraPortal = document.getElementById("extra-portal");
const botonCerrar = document.querySelector(".cerrar-portal");

galaxiasDeModos.forEach(constelacion => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-galactica";
    tarjeta.innerHTML = `
    <img src="${constelacion.imagen}" alt="${constelacion.modo}">
    <h3>${constelacion.modo}</h3>
    <p><strong>Mapa:</strong> ${constelacion.mapa}</p>
    <p>${constelacion.descripcion}</p>
  `;
    tarjeta.addEventListener("click", () => {
        tituloPortal.textContent = constelacion.modo;
        imagenPortal.src = constelacion.imagen;
        mapaPortal.textContent = constelacion.mapa;
        descripcionPortal.textContent = constelacion.descripcion;
        extraPortal.textContent = constelacion.extra;
        portalGalactico.style.display = "block";
    });
    naveTarjetas.appendChild(tarjeta);
});


document.addEventListener('DOMContentLoaded', function () {
    const cerrarBtn = document.querySelector('.cerrar-portal');
    const portal = document.getElementById('portal-galactico');

    if (cerrarBtn && portal) {
        cerrarBtn.addEventListener('click', function () {
            portal.style.display = 'none';
        });
    }

    portal?.addEventListener('click', function (e) {
        if (e.target === portal) {
            portal.style.display = 'none';
        }
    });
});

function setupMobileMenu() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

    document.querySelectorAll('.lol-navbar').forEach(navbar => {
        const navLinks = navbar.querySelector('.nav-links');

        // Insertar el botón hamburguesa
        navbar.appendChild(menuToggle.cloneNode(true));
        const currentMenuToggle = navbar.querySelector('.menu-toggle');

        // Evento click
        currentMenuToggle.addEventListener('click', () => {
            currentMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                currentMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', setupMobileMenu);
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();

});
