# FluencyFlow 📝

A smart text correction and enhancement tool powered by Google's Gemini AI. Automatically improve your writing with multiple correction modes and styles.

## Features ✨

- **Multiple Correction Modes:**
  - Passage (Casual & Formal)
  - Email (Casual & Formal)
  - Conversation (Simple & Advanced)

- **Real-time Grammar & Spell Checking**
- **Style Transformation** (Convert between casual and formal)
- **Roman Urdu Support** (Automatic translation to English)
- **User-friendly Web Interface**

## Tech Stack 🛠️

- **Backend:** Flask (Python)
- **AI:** Google Gemini 2.5 Flash
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Vercel / Netlify

## Installation & Setup 🚀

### Prerequisites
- Python 3.7+
- Google Gemini API Key (free at [Google AI Studio](https://aistudio.google.com))

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fluencyflow.git
   cd fluencyflow
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to `.env`
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application:**
   ```bash
   python main.py
   ```

5. **Open in browser:**
   ```
   http://localhost:5000
   ```

## Deployment 🌐

### Deploy to Vercel (Recommended for Flask)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy!

### Deploy to Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your GitHub repository
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy!

For detailed steps, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure 📁

```
FluencyFlow/
├── main.py                 # Flask application
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (not in GitHub)
├── .env.example           # Template for environment variables
├── .gitignore             # Git ignore rules
├── vercel.json            # Vercel configuration
├── netlify.toml           # Netlify configuration
├── DEPLOYMENT.md          # Deployment guide
├── README.md              # This file
├── static/
│   ├── css/
│   │   └── style.css      # Styling
│   └── js/
│       └── app.js         # Frontend logic
└── templates/
    └── index.html         # Main HTML page
```

## API Endpoints 🔌

### `GET /`
Serves the main page.

### `POST /correct`
Corrects text based on mode and subtype.

**Request:**
```json
{
  "text": "ur grammer is wrong",
  "mode": "passage",
  "subtype": "casual"
}
```

**Response:**
```json
{
  "corrected": "Your grammar is wrong"
}
```

## Security 🔒

- API keys are stored in `.env` (not committed to GitHub)
- `.gitignore` prevents accidental exposure
- Use environment variables for all sensitive data
- Rotate keys if compromised

## Environment Variables 🔐

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `FLASK_ENV` | Flask environment | `production` |

## Troubleshooting 🐛

### "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### "GEMINI_API_KEY environment variable is not set"
- Create `.env` file
- Add your API key: `GEMINI_API_KEY=your_key`
- Restart the app

### Port already in use
```bash
python main.py  # Change port in main.py if needed
```

## Future Enhancements 🚀

- [ ] User authentication
- [ ] Text history/undo
- [ ] More language support
- [ ] API rate limiting
- [ ] User preferences/themes
- [ ] Document upload support
- [ ] Batch processing
- [ ] Mobile app

## Contributing 🤝

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License 📄

MIT License - feel free to use this project!

## Support 💬

- Report issues on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Visit [Google AI Studio](https://aistudio.google.com) for API help

## Author ✍️

Created with ❤️ for writers who want better writing.

---

**Happy Writing! ✨**
