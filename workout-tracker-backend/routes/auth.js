const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/signup', (req, res) => {
    res.json({ message: 'Signup route' });
});

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.email}, you're authenticated!` });
});

/**
 * Login endpoint with password verification and JWT token generation
 * Returns JWT token valid for 1 hour upon successful authentication
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { email: user.email }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;