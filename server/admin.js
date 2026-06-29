const express = require('express');
const router = express.Router();
const pool = require('./db');

// POST route for admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if the admin user exists in the database
        const user = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 2. Verify password (Assuming you add bcrypt logic here later)
        // const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        const validPassword = (password === user.rows[0].password_hash); // temporary plain-text check for testing

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 3. Successful login (No OTP required)
        res.json({
            success: true,
            message: "Login successful",
            // token: jwtToken (if you implement JWTs)
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;