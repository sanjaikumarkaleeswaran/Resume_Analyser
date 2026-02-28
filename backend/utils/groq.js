const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MASTER_PROMPT = (resumeText, jobDescription, experienceLevel) => `
You are an expert ATS Resume Optimization System.

OBJECTIVE:
Strictly rewrite and recorrect the provided candidate resume to better match the given job description.
CRITICAL: DO NOT invent, hallucinate, or create new fake experiences, jobs, or degrees. 
You must ONLY use the facts, history, and structure provided in the original CANDIDATE RESUME. 
Your goal is to improve the grammar, clarity, impact, and ATS keyword matching of the existing content without fabricating new realities.

Make sure to:
- Preserve the exact truth and timeline of the original resume.
- Improve clarity, grammar, and professional tone.
- Add relevant keywords from the job description naturally, but ONLY if they fit the existing experience.
- Make bullet points measurable and impact-driven based on what they already did.
- Retain the core template and section organization of their original resume.

OUTPUT FORMAT (Return ONLY valid JSON, no markdown, no explanation):
{
  "professional_summary": "",
  "optimized_experience": "",
  "skills_section": "",
  "keyword_match_score": 0,
  "missing_keywords": [],
  "suggestions": ""
}

RULES:
- keyword_match_score must be an integer between 0 and 100
- missing_keywords must be an array of strings
- All other fields must be non-empty strings
- Return ONLY the JSON object, nothing else

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

EXPERIENCE LEVEL:
${experienceLevel}
`.trim();

/**
 * Calls Groq API with the master ATS prompt.
 * @returns {Object} Parsed AI response with structured fields
 */
async function optimizeWithAI(resumeText, jobDescription, experienceLevel) {
    const prompt = MASTER_PROMPT(resumeText, jobDescription, experienceLevel);

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: 'You are an expert ATS resume optimizer and proofreader. You MUST NOT hallucinate new experiences. Always respond with valid JSON only, nothing else.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
        max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content || '';

    // Extract JSON from the response (handle markdown code blocks if any)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('AI response did not contain valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and normalize fields
    return {
        professional_summary: String(parsed.professional_summary || ''),
        optimized_experience: String(parsed.optimized_experience || ''),
        skills_section: String(parsed.skills_section || ''),
        keyword_match_score: Math.min(100, Math.max(0, parseInt(parsed.keyword_match_score) || 0)),
        missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords.map(String) : [],
        suggestions: String(parsed.suggestions || ''),
    };
}

module.exports = { optimizeWithAI };
