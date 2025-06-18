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