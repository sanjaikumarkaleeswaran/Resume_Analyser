const express = require('express');
const multer = require('multer');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const { optimizeWithAI } = require('../utils/groq');
const { extractTextFromPDF } = require('../utils/pdfParser');
const ResumeRequest = require('../models/ResumeRequest');

// Multer: in-memory storage, 5MB limit, PDF only
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') return cb(null, true);
        cb(new Error('Only PDF files are allowed'));
    },
});

/**
 * POST /api/optimize
 * Body (multipart/form-data or json):
 *   - resume_file (optional, pdf)
 *   - resume_text (optional, string)
 *   - job_description (string)
 *   - experience_level (string)
 */
router.post('/', requireAuth, upload.single('resume_file'), async (req, res) => {
    console.log('[Multer File Check]', req.file);
    try {
        const { job_description, experience_level, resume_text } = req.body;

        if (!job_description || job_description.trim().length < 30) {
            return res.status(400).json({ error: 'Job description must be at least 30 characters.' });
        }
        if (job_description.trim().length > 10000) {
            return res.status(400).json({ error: 'Job description is too long (max 10000 characters).' });
        }

        const validLevels = ['Fresher', '1-3 Years', '3-7 Years', '7+ Years'];
        if (!experience_level || !validLevels.includes(experience_level)) {
            return res.status(400).json({ error: 'Invalid experience level.' });
        }

        let finalResumeText = '';

        if (req.file) {
            finalResumeText = await extractTextFromPDF(req.file.buffer);
        } else if (resume_text && resume_text.trim().length > 50) {
            finalResumeText = resume_text.trim();
        } else {
            return res.status(400).json({ error: 'Please upload a PDF or paste resume text (min 50 characters).' });
        }

        const aiResult = await optimizeWithAI(finalResumeText, job_description.trim(), experience_level);

        const requestDoc = new ResumeRequest({
            userId: req.user.id,
            resume_text: finalResumeText.slice(0, 10000), // cap storage
            job_description: job_description.slice(0, 5000),
            experience_level,
            professional_summary: aiResult.professional_summary,
            optimized_experience: aiResult.optimized_experience,
            skills_section: aiResult.skills_section,
            keyword_match_score: aiResult.keyword_match_score,
            missing_keywords: aiResult.missing_keywords,
            suggestions: aiResult.suggestions,
        });

        try {
            await requestDoc.save();
            res.json({ success: true, ...aiResult, id: requestDoc._id, created_at: requestDoc.createdAt });
        } catch (dbError) {
            console.error('[DB Error]', dbError.message);
            // Still return AI result even if DB save fails
            return res.json({ success: true, ...aiResult, id: null });
        }

    } catch (err) {
        console.error('[Optimize Error]', err.message);
        res.status(500).json({ error: err.message || 'Failed to optimize resume. Please try again.' });
    }
});

module.exports = router;
