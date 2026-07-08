// server.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { users } = require('./db');
const { authenticateToken, authorizeRole } = require('./middleware/auth');
const electiveController = require('./controllers/electiveController');

const app = express();
app.use(express.json());

app.post('/api/login', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.body.id, 10));
    if (!user) return res.status(404).json({ error: "User not found" });

    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '2h' });
    res.json({ token, user });
});

app.get('/api/electives', authenticateToken, electiveController.getElectives);
app.post('/api/electives/enroll', authenticateToken, authorizeRole('student'), electiveController.enroll);
app.post('/api/electives/change', authenticateToken, authorizeRole('student'), electiveController.changeElective);
app.get('/api/admin/enrollments', authenticateToken, authorizeRole('admin'), electiveController.getEnrollments);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Core Backend API running on port ${PORT}`);
    console.log(`Ready for teammate collaboration!`);
});