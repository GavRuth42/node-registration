
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Sync Database
db.sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.log('Error syncing database:', err);
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if user already exists
    const userExists = await db.User.findOne({ where: { username } });
    if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await db.User.create({
        username,
        password: hashedPassword,
        email
    });

    res.status(201).json(user);
});



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});