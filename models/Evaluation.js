const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    score: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
