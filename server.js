require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema do Funcionário
const funcionarioSchema = new mongoose.Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    equipe: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Schema da Equipe
const equipeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    lider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario',
        required: true
    },
    membros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Schema do Currículo
const curriculoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cargoPretendido: {
        type: String,
        required: true
    },
    linkCurriculo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
const Equipe = mongoose.model('Equipe', equipeSchema);
const Curriculo = mongoose.model('Curriculo', curriculoSchema);

// Rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas para Funcionários
app.get('/api/funcionarios', async (req, res) => {
    try {
        const funcionarios = await Funcionario.find();
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários', error: error.message });
    }
});

app.post('/api/funcionarios', async (req, res) => {
    try {
        const funcionario = new Funcionario(req.body);
        await funcionario.save();
        res.status(201).json(funcionario);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email já cadastrado' });
        } else {
            res.status(500).json({ message: 'Erro ao cadastrar funcionário', error: error.message });
        }
    }
});

app.put('/api/funcionarios/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.json(funcionario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar funcionário', error: error.message });
    }
});

app.delete('/api/funcionarios/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByIdAndDelete(req.params.id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.json({ message: 'Funcionário removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover funcionário', error: error.message });
    }
});

// Rotas para Equipes
app.get('/api/equipes', async (req, res) => {
    try {
        const equipes = await Equipe.find()
            .populate('lider', 'nomeCompleto')
            .populate('membros', 'nomeCompleto');
        res.json(equipes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar equipes', error: error.message });
    }
});

app.get('/api/equipes/:id', async (req, res) => {
    try {
        const equipe = await Equipe.findById(req.params.id)
            .populate('lider', 'nomeCompleto')
            .populate('membros', 'nomeCompleto');
        if (!equipe) {
            return res.status(404).json({ message: 'Equipe não encontrada' });
        }
        res.json(equipe);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar equipe', error: error.message });
    }
});

app.post('/api/equipes', async (req, res) => {
    try {
        if (req.body.membros.length < 5) {
            return res.status(400).json({ message: 'A equipe deve ter no mínimo 5 membros' });
        }

        const equipe = new Equipe(req.body);
        await equipe.save();
        
        const equipePopulada = await Equipe.findById(equipe._id)
            .populate('lider', 'nomeCompleto')
            .populate('membros', 'nomeCompleto');
            
        res.status(201).json(equipePopulada);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Já existe uma equipe com este nome' });
        } else {
            res.status(500).json({ message: 'Erro ao criar equipe', error: error.message });
        }
    }
});

app.put('/api/equipes/:id', async (req, res) => {
    try {
        if (req.body.membros && req.body.membros.length < 5) {
            return res.status(400).json({ message: 'A equipe deve ter no mínimo 5 membros' });
        }

        const equipe = await Equipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('lider', 'nomeCompleto')
        .populate('membros', 'nomeCompleto');

        if (!equipe) {
            return res.status(404).json({ message: 'Equipe não encontrada' });
        }

        res.json(equipe);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar equipe', error: error.message });
    }
});

app.delete('/api/equipes/:id', async (req, res) => {
    try {
        const equipe = await Equipe.findByIdAndDelete(req.params.id);
        if (!equipe) {
            return res.status(404).json({ message: 'Equipe não encontrada' });
        }
        res.json({ message: 'Equipe removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover equipe', error: error.message });
    }
});

// Rotas para Currículos
app.get('/api/curriculos', async (req, res) => {
    try {
        const curriculos = await Curriculo.find().sort({ createdAt: -1 });
        res.json(curriculos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar currículos', error: error.message });
    }
});

app.post('/api/curriculos', async (req, res) => {
    try {
        const curriculo = new Curriculo(req.body);
        await curriculo.save();
        res.status(201).json(curriculo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar currículo', error: error.message });
    }
});

app.delete('/api/curriculos/:id', async (req, res) => {
    try {
        const curriculo = await Curriculo.findByIdAndDelete(req.params.id);
        if (!curriculo) {
            return res.status(404).json({ message: 'Currículo não encontrado' });
        }
        res.json({ message: 'Currículo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover currículo', error: error.message });
    }
});

// server.js
app.get('/equipe-lider', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'equipe-lider.html'));
});

// server.js
// server.js
app.post('/api/equipes/:id/avaliacao', async (req, res) => {
    try {
        const equipeId = req.params.id;
        const { avaliacao, comentarios } = req.body;

        // Salvar as avaliações e comentários no banco de dados
        await Equipe.findByIdAndUpdate(equipeId, { avaliacoes: avaliacao, comentarios });

        res.json({ message: 'Avaliação salva com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar avaliação', error: error.message });
    }
});

// server.js
app.get('/api/equipes', async (req, res) => {
    try {
        const equipes = await Equipe.find()
            .populate('lider', 'nomeCompleto')
            .populate('membros', 'nomeCompleto');
        res.json(equipes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar equipes', error: error.message });
    }
});

// server.js
app.get('/api/avaliacoes', async (req, res) => {
    try {
        const equipes = await Equipe.find({}, { nome: 1, avaliacoes: 1, comentarios: 1 });
        const avaliacoes = equipes.map(equipe => ({
            nome: equipe.nome,
            avaliacoes: equipe.avaliacoes,
            comentarios: equipe.comentarios
        }));
        res.json(avaliacoes);
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Schema de Usuários
const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    categoria: { type: String, enum: ['adm', 'lider'], required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Usuario = mongoose.model('Usuario', usuarioSchema);
  
  // Rotas de registro
  app.post('/api/registro', async (req, res) => {
    try {
      const { nome, email, senha, categoria } = req.body;
      if (!['adm', 'lider'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoria inválida' });
      }
  
      const novoUsuario = new Usuario({ nome, email, senha, categoria });
      await novoUsuario.save();
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  });
  
  // Rotas de login
  app.post('/api/login', async (req, res) => {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.findOne({ email, senha });
  
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
  
      res.json({ categoria: usuario.categoria });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
  });
  

