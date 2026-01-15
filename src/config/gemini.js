import fetch from "node-fetch";

const GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent";

function cleanResponse(text) {
    if (!text) return "";
    return text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/[`#_>-]/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();
}

export async function geminiChat(prompt) {
    try {
        const res = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }],
                }, ],
            }),
        });

        const data = await res.json();

        // 🔐 SAFETY CHECKS (VERY IMPORTANT)
        if (!data ||
            !data.candidates ||
            !Array.isArray(data.candidates) ||
            data.candidates.length === 0 ||
            !data.candidates[0].content ||
            !data.candidates[0].content.parts ||
            data.candidates[0].content.parts.length === 0 ||
            !data.candidates[0].content.parts[0].text
        ) {
            return "Based on general food safety guidelines, this food should be consumed within a few hours if stored properly.";
        }

        return cleanResponse(data.candidates[0].content.parts[0].text);

    } catch (err) {
        console.error("Gemini REST API Error:", err);
        return "Based on general food safety guidelines, this food should be consumed within a few hours if stored properly.";
    }
}