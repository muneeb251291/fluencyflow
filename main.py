from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ── App Configuration ──────────────────────────────────────────────────────────
app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# ── Prompt Templates ──────────────────────────────────────────────────────────
# Each key is "mode:subtype". The prompt tells Gemini exactly what style to use.

PROMPTS = {
    # ── Passage ────────────────────────────────────────────────────────────
    "passage:casual": (
        "You are a friendly writing assistant. "
        "Rewrite the following text so it is grammatically correct, naturally flowing, "
        "and keeps a casual, conversational tone — like someone talking to a friend. "
        "Fix spelling, grammar, and punctuation but keep contractions and everyday language. "
        "Return ONLY the corrected text — no explanations.\n\n"
        "Text:\n{text}"
    ),
    "passage:formal": (
        "You are a professional English editor. "
        "Rewrite the following text in a polished, formal tone suitable for academic papers, "
        "reports, or official documents. Fix all grammar, spelling, and punctuation errors. "
        "Use complete sentences, avoid contractions, and maintain a sophisticated style. "
        "Return ONLY the corrected text — no explanations.\n\n"
        "Text:\n{text}"
    ),

    # ── Email ──────────────────────────────────────────────────────────────
    "email:formal": (
        "You are a professional email writing assistant. "
        "Rewrite the following text as a well-structured, formal email. "
        "Include a proper greeting (e.g., 'Dear …') and a professional closing (e.g., 'Best regards'). "
        "Correct all grammar, spelling, and punctuation. Use a respectful, business-appropriate tone. "
        "Do NOT add a subject line. Return ONLY the corrected email body — no explanations.\n\n"
        "Text:\n{text}"
    ),
    "email:casual": (
        "You are a friendly email writing assistant. "
        "Rewrite the following text as a casual, warm email you'd send to a colleague or friend. "
        "Include a light greeting (e.g., 'Hey …' or 'Hi …') and a relaxed closing (e.g., 'Cheers' or 'Talk soon'). "
        "Fix grammar and spelling but keep the tone friendly, natural, and approachable. "
        "Do NOT add a subject line. Return ONLY the corrected email body — no explanations.\n\n"
        "Text:\n{text}"
    ),

    # ── Conversation ───────────────────────────────────────────────────────
    "conversation:simple": (
        "You are a helpful language assistant. having corporate tone "
        "The user has written a conversation or chat-style message. "
        "Always turn the bad words into sophesticated words."
        "Correct it for basic grammar, spelling, and punctuation while keeping it short, "
        "simple, and easy to understand. Maintain the casual chat feel. "
        "If the text is in Roman Urdu (Urdu written in English letters, e.g., 'Kya haal hai'), "
        "translate it into clear, simple English. "
        "Return ONLY the corrected/translated text — no explanations.\n\n"
        "Text:\n{text}"
    ),
    "conversation:advanced": (
        "You are an advanced language and conversation expert. "
        "The user has written a conversation or chat-style message. "
        "Rewrite it using rich, expressive vocabulary while keeping it natural and engaging. "
        "You may use widely understood English slang and idiomatic expressions "
        "(e.g., 'no cap', 'that's fire', 'lowkey', 'vibe') where they fit naturally. "
        "If the text contains Roman Urdu (Urdu written in English letters such as "
        "'Kaisi hai aap', 'Mujhe samajh nahi aya', 'Yaar kya kar rahe ho'), "
        "translate it fully into fluent, expressive English. "
        "Fix all grammar and spelling. "
        "Return ONLY the corrected/translated text — no explanations.\n\n"
        "Text:\n{text}"
    ),
}

# Fallback prompt if mode/subtype is unknown
DEFAULT_PROMPT = (
    "You are a professional English editor. "
    "Correct the following text for grammar, spelling, and punctuation. "
    "Keep the original meaning and tone intact. "
    "Return ONLY the corrected text — no explanations, no extra commentary.\n\n"
    "Text:\n{text}"
)


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")


@app.route("/correct", methods=["POST"])
def correct_text():
    """Accept raw text + mode/subtype and return the polished version."""
    data = request.get_json(silent=True)
    if not data or not data.get("text", "").strip():
        return jsonify({"error": "No text provided."}), 400

    raw_text = data["text"].strip()
    mode = data.get("mode", "passage").strip().lower()
    subtype = data.get("subtype", "casual").strip().lower()

    key = f"{mode}:{subtype}"
    template = PROMPTS.get(key, DEFAULT_PROMPT)
    prompt = template.format(text=raw_text)

    try:
        response = model.generate_content(prompt)
        corrected = response.text.strip()
        return jsonify({"corrected": corrected})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# ── Entry Point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
