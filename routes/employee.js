const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, position, entryDate } = req.body;
    const employee = new Employee({ name, position, entryDate });
    await employee.save();
    res.json({ message: 'Employee registered successfully' });
});

module.exports = router;
