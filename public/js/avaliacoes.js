// public/avaliacoes.js
document.addEventListener('DOMContentLoaded', () => {
    carregarAvaliacoes();
});

async function carregarAvaliacoes() {
    try {
        const response = await fetch('/api/avaliacoes');
        const avaliacoes = await response.json();

        const avaliacoesContainer = document.getElementById('avaliacoes-container');
        avaliacoesContainer.innerHTML = '';

        avaliacoes.forEach(avaliacao => {
            const avaliacaoCard = criarCardAvaliacao(avaliacao);
            avaliacoesContainer.appendChild(avaliacaoCard);
        });
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        const avaliacoesContainer = document.getElementById('avaliacoes-container');
        avaliacoesContainer.innerHTML = '<p class="error-message">Erro ao carregar avaliações</p>';
    }
}
function criarCardAvaliacao(avaliacao) {
    const div = document.createElement('div');
    div.className = 'avaliacao-card';

    const nomeEquipe = avaliacao.nome || 'Nome não disponível';

    div.innerHTML = `
        <h3>${nomeEquipe}</h3>
        <div class="avaliacao-info">
            <h4>Avaliações</h4>
            <table>
                <thead>
                    <tr>
                        <th>Membro</th>
                        <th>Avaliação</th>
                        <th>Comentário</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(avaliacao.avaliacoes).map(membroId => `
                        <tr>
                            <td>${avaliacao.membros.find(membro => membro._id === membroId)?.nomeCompleto || 'Nome não disponível'}</td>
                            <td>${avaliacao.avaliacoes[membroId]}</td>
                            <td>${avaliacao.comentarios[membroId] || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    return div;
}