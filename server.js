const express = require('express');
const app = express();
app.use(express.json());




let funcionarios = [];


app.post('/api/funcionarios', (req, res) => {
    const { nome, cargo, data_admissao } = req.body;
    const novoFuncionario = {
        id: funcionarios.length + 1,
        nome,
        cargo,
        data_admissao
    };
    funcionarios.push(novoFuncionario);
    res.status(201).send(novoFuncionario);
});


app.get('/api/funcionarios', (req, res) => {
    res.status(200).send(funcionarios);
});


app.get('/api/funcionarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const funcionario = funcionarios.find(f => f.id === id);
    if (!funcionario) return res.status(404).send('Funcionário não encontrado');
    res.status(200).send(funcionario);
});


app.put('/api/funcionarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, cargo, data_admissao } = req.body;
    let funcionario = funcionarios.find(f => f.id === id);
    if (!funcionario) return res.status(404).send('Funcionário não encontrado');
    
    funcionario.nome = nome;
    funcionario.cargo = cargo;
    funcionario.data_admissao = data_admissao;
    
    res.status(200).send(funcionario);
});


app.delete('/api/funcionarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    funcionarios = funcionarios.filter(f => f.id !== id);
    res.status(200).send({ message: 'Funcionário removido com sucesso!' });
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


let curriculos = [];


app.post('/api/curriculos', (req, res) => {
    const { nome_candidato, email, cargo_pretendido, link_curriculo } = req.body;
    
    const novoCurriculo = {
        id: curriculos.length + 1,
        nome_candidato,
        email,
        cargo_pretendido,
        link_curriculo
    };
    
    curriculos.push(novoCurriculo);
    res.status(201).send(novoCurriculo);
});


app.get('/api/curriculos', (req, res) => {
    res.status(200).send(curriculos);
});


app.get('/api/curriculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const curriculo = curriculos.find(c => c.id === id);
    
    if (!curriculo) return res.status(404).send('Currículo não encontrado');
    res.status(200).send(curriculo);
});


app.put('/api/curriculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome_candidato, email, cargo_pretendido, link_curriculo } = req.body;
    
    let curriculo = curriculos.find(c => c.id === id);
    if (!curriculo) return res.status(404).send('Currículo não encontrado');
    
    curriculo.nome_candidato = nome_candidato;
    curriculo.email = email;
    curriculo.cargo_pretendido = cargo_pretendido;
    curriculo.link_curriculo = link_curriculo;
    
    res.status(200).send(curriculo);
});


app.delete('/api/curriculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    curriculos = curriculos.filter(c => c.id !== id);
    res.status(200).send({ message: 'Currículo removido com sucesso!' });
});



let bonificacoes = [];


app.post('/api/bonificacoes', (req, res) => {
    const { funcionarioId, tipo } = req.body;
    const funcionario = funcionarios.find(f => f.id === funcionarioId);
    if (!funcionario) return res.status(404).send('Funcionário não encontrado');

    const novaBonificacao = {
        id: bonificacoes.length + 1,
        funcionarioId,
        tipo,
        data: new Date()
    };
    bonificacoes.push(novaBonificacao);
    res.status(201).send(novaBonificacao);
});

app.get('/api/bonificacoes', (req, res) => {
    res.status(200).send(bonificacoes);
});


let avaliacoes = [];


app.post('/api/avaliacoes', (req, res) => {
    const { funcionarioId, nota, comentario } = req.body;

   
    const funcionario = funcionarios.find(f => f.id === funcionarioId);
    if (!funcionario) return res.status(404).send('Funcionário não encontrado');

    const novaAvaliacao = {
        id: avaliacoes.length + 1,
        funcionarioId,
        nota,
        comentario,
        data: new Date()
    };

    avaliacoes.push(novaAvaliacao);
    res.status(201).send(novaAvaliacao);
});


app.get('/api/avaliacoes', (req, res) => {
    res.status(200).send(avaliacoes);
});


app.get('/api/avaliacoes/funcionario/:funcionarioId', (req, res) => {
    const funcionarioId = parseInt(req.params.funcionarioId);
    const avaliacoesFuncionario = avaliacoes.filter(a => a.funcionarioId === funcionarioId);
    
    if (avaliacoesFuncionario.length === 0) return res.status(404).send('Nenhuma avaliação encontrada para este funcionário');
    res.status(200).send(avaliacoesFuncionario);
});


app.delete('/api/avaliacoes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    avaliacoes = avaliacoes.filter(a => a.id !== id);
    res.status(200).send({ message: 'Avaliação removida com sucesso!' });
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bancoteste26:testebanco123@gerenciamento-rh.s2rsu.mongodb.net/')
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error);
    });

app.get('/api/bonificacoes/avaliacao', (req, res) => {
    const mediaFuncionarios = funcionarios.map(funcionario => {
        const avaliacoesFuncionario = avaliacoes.filter(a => a.funcionarioId === funcionario.id);
        const mediaNota = avaliacoesFuncionario.length > 0 
            ? avaliacoesFuncionario.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoesFuncionario.length
            : 0;
        return { id: funcionario.id, nome: funcionario.nome, mediaNota };
    });

    mediaFuncionarios.sort((a, b) => b.mediaNota - a.mediaNota);
    
    res.send({
        melhorFuncionario: mediaFuncionarios[0] || null,
        piorFuncionario: mediaFuncionarios[mediaFuncionarios.length - 1] || null
    });
});
