const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume_text: String,
    job_description: String,
    experience_level: String,
    professional_summary: String,
    optimized_experience: String,
    skills_section: String,
    keyword_match_score: Number,
    missing_keywords: [String],
    suggestions: String,
}, { timestamps: true });

module.exports = mongoose.model('ResumeRequest', requestSchema);
