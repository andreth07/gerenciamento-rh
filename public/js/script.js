document.getElementById('formFuncionario').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const cargo = document.getElementById('cargo').value;
    const data_admissao = document.getElementById('data_admissao').value;

    const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cargo, data_admissao }),
    });

    if (response.ok) {
        alert('Funcionário adicionado com sucesso!');
        // Limpa o formulário
        document.getElementById('formFuncionario').reset();
    } else {
        alert('Erro ao adicionar funcionário.');
    }
});

document.getElementById('formBonificacao').addEventListener('submit', async (event) => {
    event.preventDefault();

    const funcionarioId = document.getElementById('funcionarioId').value;
    const tipo = document.getElementById('tipo').value;

    const response = await fetch('/api/bonificacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ funcionarioId, tipo }),
    });

    if (response.ok) {
        alert('Bonificação registrada com sucesso!');
        // Limpa o formulário
        document.getElementById('formBonificacao').reset();
    } else {
        alert('Erro ao registrar bonificação.');
    }
});

document.getElementById('avaliacaoForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const funcionarioId = document.getElementById('funcionarioId').value;
    const nota = document.getElementById('nota').value;
    const comentario = document.getElementById('comentario').value;

    const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcionarioId, nota, comentario })
    });

    if (response.ok) {
        const novaAvaliacao = await response.json();
        console.log('Avaliação adicionada:', novaAvaliacao);
        document.getElementById('avaliacaoForm').reset();
        carregarAvaliacoes();
    } else {
        const error = await response.text();
        alert(error);
    }
});

// Função para carregar e exibir as avaliações
async function carregarAvaliacoes() {
    const response = await fetch('/api/avaliacoes');
    const avaliacoes = await response.json();
    const avaliacoesList = document.getElementById('avaliacoesList');
    avaliacoesList.innerHTML = '';

    avaliacoes.forEach(avaliacao => {
        const li = document.createElement('li');
        li.textContent = `ID: ${avaliacao.funcionarioId} - Nota: ${avaliacao.nota} - Comentário: ${avaliacao.comentario}`;
        avaliacoesList.appendChild(li);
    });
}

// Carregar as avaliações ao iniciar
carregarAvaliacoes();

document.addEventListener('DOMContentLoaded', () => {
    const funcionarioForm = document.getElementById('funcionarioForm');
    const curriculoForm = document.getElementById('curriculoForm');
    const bonificacaoForm = document.getElementById('bonificacaoForm');
    const avaliacaoForm = document.getElementById('avaliacaoForm');
    const listaFuncionarios = document.getElementById('listaFuncionarios');
    const listaCurriculos = document.getElementById('listaCurriculos');
    const listaBonificacoes = document.getElementById('listaBonificacoes');
    const listaAvaliacoes = document.getElementById('listaAvaliacoes');

    if (funcionarioForm) {
        funcionarioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const cargo = document.getElementById('cargo').value;
            const data_admissao = document.getElementById('data_admissao').value;

            const response = await fetch('http://localhost:3000/funcionarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, cargo, data_admissao }),
            });

            if (response.ok) {
                alert('Funcionário cadastrado com sucesso!');
                listarFuncionarios();
            } else {
                alert('Erro ao cadastrar funcionário.');
            }
        });
    }

    if (curriculoForm) {
        curriculoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome_candidato = document.getElementById('nome_candidato').value;
            const email = document.getElementById('email').value;
            const cargo_pretendido = document.getElementById('cargo_pretendido').value;
            const link_curriculo = document.getElementById('link_curriculo').value;

            const response = await fetch('http://localhost:3000/curriculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome_candidato, email, cargo_pretendido, link_curriculo }),
            });

            if (response.ok) {
                alert('Currículo cadastrado com sucesso!');
                listarCurriculos();
            } else {
                alert('Erro ao cadastrar currículo.');
            }
        });
    }

    async function listarFuncionarios() {
        const response = await fetch('http://localhost:3000/funcionarios');
        const funcionarios = await response.json();
        listaFuncionarios.innerHTML = '';
        funcionarios.forEach(funcionario => {
            const li = document.createElement('li');
            li.textContent = `${funcionario.nome} - ${funcionario.cargo}`;
            listaFuncionarios.appendChild(li);
        });
    }

    async function listarCurriculos() {
        const response = await fetch('http://localhost:3000/curriculos');
        const curriculos = await response.json();
        listaCurriculos.innerHTML = '';
        curriculos.forEach(curriculo => {
            const li = document.createElement('li');
            li.textContent = `${curriculo.nome_candidato} - ${curriculo.cargo_pretendido}`;
            listaCurriculos.appendChild(li);
        });
    }

    // Funções para listar bonificações e avaliações serão semelhantes a essas.
});

async function carregarBonificacaoAvaliacao() {
    const response = await fetch('/api/bonificacoes/avaliacao');
    const data = await response.json();

    if (data.melhorFuncionario) {
        alert(`Melhor Funcionário: ${data.melhorFuncionario.nome} com média ${data.melhorFuncionario.mediaNota}`);
    }

    if (data.piorFuncionario) {
        alert(`Pior Funcionário: ${data.piorFuncionario.nome} com média ${data.piorFuncionario.mediaNota}`);
    }
}
