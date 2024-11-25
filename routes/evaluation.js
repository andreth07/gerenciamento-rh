const express = require('express');
const Evaluation = require('../models/Evaluation');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { employeeId, score } = req.body;
    const evaluation = new Evaluation({ employee: employeeId, score });
    await evaluation.save();
    res.json({ message: 'Evaluation registered successfully' });
});

module.exports = router;
