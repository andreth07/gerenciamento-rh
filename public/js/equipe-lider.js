// equipe-lider.js
document.addEventListener('DOMContentLoaded', () => {
    carregarEquipes();
});

async function carregarEquipes() {
    try {
        const response = await fetch('/api/equipes');
        const equipes = await response.json();

        const equipeContainer = document.getElementById('equipe-container');
        equipeContainer.innerHTML = '';

        equipes.forEach(equipe => {
            const equipeCard = criarCardEquipe(equipe);
            equipeContainer.appendChild(equipeCard);
        });
    } catch (error) {
        console.error('Erro ao carregar equipes:', error);
        const equipeContainer = document.getElementById('equipe-container');
        equipeContainer.innerHTML = '<p class="error-message">Erro ao carregar equipes</p>';
    }
}

function criarCardEquipe(equipe) {
    const div = document.createElement('div');
    div.className = 'equipe-card';

    const nomeEquipe = equipe.nome || 'Nome não disponível';
    const liderNome = equipe.lider?.nomeCompleto || 'Líder não definido';
    const membros = equipe.membros || [];

    div.innerHTML = `
        <h3>${nomeEquipe}</h3>
        <div class="equipe-info">
            <p><strong>Líder:</strong> ${liderNome}</p>
            <div class="equipe-membros">
                <strong>Membros da Equipe:</strong>
                <ul>
                    ${membros.map(membro => membro.nomeCompleto ? `<li>${membro.nomeCompleto}</li>` : '<li>Nome não disponível</li>').join('')}
                </ul>
            </div>
        </div>
        <div class="equipe-avaliacao">
            <h4>Avalie o desempenho da equipe:</h4>
            <form class="avaliacao-form" onsubmit="submeterAvaliacao(event, '${equipe._id}')">
                ${membros.map(membro => `
                    <div class="membro-avaliacao">
                        <label for="avaliacao_${membro._id}">${membro.nomeCompleto}:</label>
                        <select id="avaliacao_${membro._id}" name="avaliacao_${membro._id}" required>
                            <option value="">Selecione uma nota</option>
                            ${Array.from({ length: 11 }, (_, i) => i).map(nota => `
                                <option value="${nota}">${nota}</option>
                            `).join('')}
                        </select>
                        <input type="text" id="comentario_${membro._id}" name="comentario_${membro._id}" placeholder="Adicione um comentário" required>
                    </div>
                `).join('')}
                <button type="submit" class="btn-salvar">Salvar Avaliação</button>
            </form>
        </div>
    `;

    return div;
}

async function submeterAvaliacao(event, equipeId) {
    event.preventDefault();

    const form = event.target;
    const avaliacao = {};
    const comentarios = {};

    form.querySelectorAll('select').forEach(select => {
        const memberId = select.id.split('_')[1];
        avaliacao[memberId] = parseInt(select.value);
    });

    form.querySelectorAll('input[type="text"]').forEach(input => {
        const memberId = input.id.split('_')[1];
        comentarios[memberId] = input.value;
    });

    try {
        const response = await fetch(`/api/equipes/${equipeId}/avaliacao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ avaliacao, comentarios })
        });

        if (response.ok) {
            alert('Avaliação salva com sucesso!');
            form.reset();
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao salvar avaliação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar avaliação');
    }
}