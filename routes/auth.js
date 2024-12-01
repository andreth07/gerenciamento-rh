// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rota de registro
router.post('/register', async (req, res) => {
  // Lógica de registro do usuário
});

// Rota de login
router.post('/login', async (req, res) => {
  // Lógica de login do usuário
});

module.exports = router;