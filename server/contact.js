const express = require('express');
const router = express.Router();
const pool = require('./db');

// POST route to submit a new message
router.post('/', async (req, res) => {
    try {
        // Extract the data sent from your frontend form
        const { name, email, message } = req.body;

        const newMsg = await pool.query(
            'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
        );

        res.json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (err) {
        console.error("Message submission failed:", err.message);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

module.exports = router;