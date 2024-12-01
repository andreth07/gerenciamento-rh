document.addEventListener('DOMContentLoaded', () => {
    carregarAvaliacoesEquipes();
  });
  
  async function carregarAvaliacoesEquipes() {
    try {
      const response = await fetch('/api/equipes/avaliacoes');
      const avaliacoes = await response.json();
  
      const tableBody = document.querySelector('#equipe-avaliacoes-table tbody');
      tableBody.innerHTML = '';
  
      avaliacoes.forEach(avaliacao => {
        const row = document.createElement('tr');
  
        const equipeCell = document.createElement('td');
        equipeCell.textContent = avaliacao.nomeEquipe;
  
        const liderCell = document.createElement('td');
        liderCell.textContent = avaliacao.liderNome;
  
        const mediaNotasCell = document.createElement('td');
        mediaNotasCell.textContent = avaliacao.mediaNotas.toFixed(2);
  
        const acaoCell = document.createElement('td');
        const verDetalhesButton = document.createElement('button');
        verDetalhesButton.textContent = 'Ver Detalhes';
        verDetalhesButton.addEventListener('click', () => exibirDetalhesAvaliacao(avaliacao));
        acaoCell.appendChild(verDetalhesButton);
  
        row.appendChild(equipeCell);
        row.appendChild(liderCell);
        row.appendChild(mediaNotasCell);
        row.appendChild(acaoCell);
  
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao carregar avaliações de equipes:', error);
      const tableBody = document.querySelector('#equipe-avaliacoes-table tbody');
      tableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar avaliações de equipes</td></tr>';
    }
  }
  
  function exibirDetalhesAvaliacao(avaliacao) {
    // Lógica para exibir os detalhes da avaliação da equipe, como notas e comentários individuais
    console.log(avaliacao);
  }