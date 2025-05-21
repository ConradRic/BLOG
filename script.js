// Configurações (SUBSTITUA MESMO QUE JÁ TENHA COLOCADO)
const PUBLIC_KEY = '8df0c95794821f0139338afacd2958ee'; // ← Coloque SUA chave aqui
const PRIVATE_KEY = '94e93552d52ea11e552ff4bbd0fa30296817a9df'; // ← Coloque SUA chave aqui
const API_URL = 'https://gateway.marvel.com/v1/public/';

// Debug inicial (verifica se as chaves estão carregando)
console.log('🔑 Chave Pública:', PUBLIC_KEY.length === 32 ? '✅ OK' : '❌ Tamanho incorreto');
console.log('🔐 Chave Privada:', PRIVATE_KEY.length === 32 ? '✅ OK' : '❌ Tamanho incorreto');

// 1. Geração do hash CORRIGIDA
function generateHash(timestamp) {
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + PUBLIC_KEY).toString();
    console.log(`🔢 Hash gerado (ts=${timestamp}):`, hash);
    return hash;
}

// 2. Busca na API com tratamento de erro MELHORADO
async function fetchHeroData(heroName) {
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
    const url = `${API_URL}characters?name=${encodeURIComponent(heroName)}&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}`;

    console.log(`🌐 Buscando: ${heroName}`, url);

    try {
        const response = await fetch(url);
        
        // Verifica se a resposta veio mesmo com status 200
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📦 Dados recebidos para ${heroName}:`, data);

        // Verifica se tem resultados
        if (data.data.results.length === 0) {
            console.warn(`⚠️ Personagem não encontrado: ${heroName}`);
            return null;
        }

        return data.data.results[0];
    } catch (error) {
        console.error(`❌ Erro grave ao buscar ${heroName}:`, error);
        return null;
    }
}

// 3. Atualização dos cards com fallback
async function updateAllCards() {
    const cards = document.querySelectorAll('.card');
    console.log(`🃏 Total de cards encontrados: ${cards.length}`);

    for (const card of cards) {
        const heroName = card.getAttribute('data-hero');
        console.log(`🔄 Processando: ${heroName}`);

        const heroData = await fetchHeroData(heroName);
        const img = card.querySelector('img');

        if (heroData) {
            // URL corrigida para imagens (https obrigatório)
            const imageUrl = `${heroData.thumbnail.path.replace('http://', 'https://')}/portrait_uncanny.${heroData.thumbnail.extension}`;
            console.log(`🖼️ Imagem de ${heroName}:`, imageUrl);
            
            img.src = imageUrl;
            img.alt = heroData.name;
            img.onerror = () => {
                console.warn(`⚠️ Falha ao carregar imagem de ${heroName}`);
                img.src = 'https://via.placeholder.com/300x200?text=Imagem+não+encontrada';
            };
        } else {
            img.src = 'https://via.placeholder.com/300x200?text=Personagem+não+encontrado';
            console.warn(`🚨 Fallback ativado para ${heroName}`);
        }
    }
}

// 4. Inicialização com tratamento de erros GLOBAL
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await updateAllCards();
        console.log('🎉 Todos os cards foram atualizados!');
    } catch (error) {
        console.error('💥 ERRO GRAVE durante inicialização:', error);
        alert('Ocorreu um erro ao carregar os heróis. Verifique o console (F12) para detalhes.');
    }
});