document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById("Lista")

   

    async function buscarFeriado() {

        try {
            const resposta = await fetch(`https://brasilapi.com.br/api/feriados/v1/2025`);
            
            if (!resposta.ok) {
                throw new Error('Feriado não encontrado');
            }

            const dados = await resposta.json();
            
            if (dados.length === 0) {
                mostrarResultado('Nenhum feriado encontrado com esse nome', true);
                return;
            }

            console.log (dados);

            dados.forEach(feriado => {
                 const f = document.createElement("p")
                 f.innerText = formatarData(feriado.date) + " ➡️ " + feriado.name
                 lista.append (f)
                
            });

           

            
        } catch (erro) {
            mostrarResultado(erro.message, true);
        }
    }

    buscarFeriado()

    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    }

});