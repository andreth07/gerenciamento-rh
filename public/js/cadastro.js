document.addEventListener('DOMContentLoaded', carregarFuncionarios);

document.getElementById('funcionarioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const funcionario = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        cargo: document.getElementById('cargo').value,
        email: document.getElementById('email').value,
        equipe: document.getElementById('equipe').value
    };

    try {
        const response = await fetch('/api/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        if (response.ok) {
            alert('Funcionário cadastrado com sucesso!');
            this.reset();
            carregarFuncionarios();
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao cadastrar funcionário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar funcionário');
    }
});

async function carregarFuncionarios() {
    try {
        const response = await fetch('/api/funcionarios');
        const funcionarios = await response.json();
        
        const funcionariosList = document.getElementById('funcionariosList');
        funcionariosList.innerHTML = '';

        funcionarios.forEach(funcionario => {
            const card = criarCardFuncionario(funcionario);
            funcionariosList.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

function criarCardFuncionario(funcionario) {
    const div = document.createElement('div');
    div.className = 'funcionario-card';
    div.innerHTML = `
        <h3>${funcionario.nomeCompleto}</h3>
        <p class="funcionario-info">Cargo: ${funcionario.cargo}</p>
        <p class="funcionario-info">Email: ${funcionario.email}</p>
        <p class="funcionario-info">Equipe: ${funcionario.equipe}</p>
        <div class="funcionario-acoes">
            <button class="btn-editar" onclick="editarFuncionario('${funcionario._id}')">Editar</button>
            <button class="btn-excluir" onclick="excluirFuncionario('${funcionario._id}')">Excluir</button>
        </div>
    `;
    return div;
}

async function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            const response = await fetch(`/api/funcionarios/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Funcionário excluído com sucesso!');
                carregarFuncionarios();
            } else {
                alert('Erro ao excluir funcionário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir funcionário');
        }
    }
}

async function carregarAvaliacoes() {
    try {
        const response = await fetch('/api/avaliacoes');
        const avaliacoes = await response.json();

        const container = document.getElementById('avaliacoesContainer');
        container.innerHTML = '';

        avaliacoes.forEach(avaliacao => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Equipe: ${avaliacao.equipe.nome}</h3>
                <p>Avaliador: ${avaliacao.avaliador.nomeCompleto}</p>
                <ul>
                    ${avaliacao.avaliacoes.map(a => `
                        <li>${a.funcionario.nomeCompleto}: ${a.nota}</li>
                    `).join('')}
                </ul>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

carregarAvaliacoes();


function editarFuncionario(id) {
    // Implementar a funcionalidade de edição
    alert('Funcionalidade de edição em desenvolvimento');
}