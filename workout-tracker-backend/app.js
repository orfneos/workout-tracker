const mongoose = require('mongoose');
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mydb')
    .then(() => console.log('✅ Συνδέθηκε!'))
    .catch(err => console.error('❌ Σφάλμα:', err.message));

app.use(express.json());

app.use('/', authRoutes);

module.exports = app;