const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ResumeRequest = require('../models/ResumeRequest');

/**
 * GET /api/history
 * Returns the authenticated user's optimization history, newest first.
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const history = await ResumeRequest.find({ userId: req.user.id })
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ success: true, history: history || [] });
    } catch (err) {
        console.error('[History Error]', err.message);
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

module.exports = router;
