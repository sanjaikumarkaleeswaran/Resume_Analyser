const pdfParse = require('pdf-parse');

/**
 * Extracts plain text from a PDF buffer.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} Extracted text content
 */
async function extractTextFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        const text = data.text?.trim();
        if (!text || text.length < 50) {
            throw new Error('PDF appears to be empty or unreadable. Please try pasting your resume text directly.');
        }
        return text;
    } catch (err) {
        console.error('[PDF Parse Original Error]', err);
        if (err.message && err.message.includes('empty or unreadable')) throw err;
        throw new Error('Failed to parse PDF. Please ensure it is a valid, text-based PDF file.');
    }
}

module.exports = { extractTextFromPDF };
