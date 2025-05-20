// Substitua pelas SUAS chaves!
const PUBLIC_KEY = '8df0c95794821f0139338afacd2958ee';
const PRIVATE_KEY = '94e93552d52ea11e552ff4bbd0fa30296817a9df';
const BASE_URL = 'https://gateway.marvel.com/v1/public/';

// 1. Gerar hash (exigido pela API)
function generateHash(timestamp) {
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + PUBLIC_KEY).toString();
    return hash;
}

// 2. Buscar heróis
async function fetchHeroes() {
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
    const url = `${BASE_URL}characters?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=20`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayHeroes(data.data.results);
    } catch (error) {
        console.error('Erro ao buscar heróis:', error);
    }
}

// 3. Exibir heróis na página
function displayHeroes(heroes) {
    const grid = document.getElementById('heroes-grid');
    grid.innerHTML = '';

    heroes.forEach(hero => {
        const imageUrl = `${hero.thumbnail.path}/standard_xlarge.${hero.thumbnail.extension}`;
        
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        heroCard.innerHTML = `
            <img src="${imageUrl}" alt="${hero.name}" class="hero-image">
            <div class="hero-name">${hero.name}</div>
        `;
        
        grid.appendChild(heroCard);
    });
}

// Inicializar
fetchHeroes();