# FluencyFlow Deployment Guide

## 🔐 Security Setup (IMPORTANT - Do This First!)

### Step 1: Update Your API Key Securely

1. Open the `.env` file in the project root
2. Replace `your_api_key_here` with your actual Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **NEVER commit `.env` to GitHub!** It's already in `.gitignore`

### Step 2: Verify `.gitignore`

Make sure `.gitignore` includes `.env`:
```
.env
.env.local
```

---

## 📦 Pre-Deployment Checklist

- [ ] `.env` file created with your API key
- [ ] `.gitignore` file created and includes `.env`
- [ ] `requirements.txt` generated
- [ ] `main.py` updated to use environment variables
- [ ] All files committed to GitHub (except `.env`)

---

## 🚀 Deployment Option 1: VERCEL

### Step 1: Initialize Git Repository

```powershell
cd c:\Users\sufya\Downloads\Proj\FluencyFlow
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `fluencyflow`)
3. Push your code:
   ```powershell
   git remote add origin https://github.com/your-username/fluencyflow.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up or log in with GitHub
3. Click **"Import Project"**
4. Select your GitHub repository
5. Vercel will auto-detect it's a Python project
6. **Important:** Add Environment Variables:
   - Go to **Settings** → **Environment Variables**
   - Add: `GEMINI_API_KEY` = your_api_key_here
   - Add: `FLASK_ENV` = `production`
7. Click **"Deploy"**
8. Wait 2-5 minutes for deployment to complete
9. Your app will be live at: `https://your-project-name.vercel.app`

### Troubleshooting Vercel:
- If you get a "No module named 'flask'" error, check `requirements.txt`
- Check deployment logs in Vercel dashboard for errors
- Ensure `.env` is in `.gitignore` (not committed to GitHub)

---

## 🚀 Deployment Option 2: NETLIFY

### Step 1: Initialize Git Repository

```powershell
cd c:\Users\sufya\Downloads\Proj\FluencyFlow
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository
3. Push your code:
   ```powershell
   git remote add origin https://github.com/your-username/fluencyflow.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Netlify

1. Go to https://netlify.com
2. Sign up or log in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select GitHub and authorize Netlify
5. Choose your repository
6. Configure build settings:
   - **Build command:** `pip install -r requirements.txt`
   - **Publish directory:** `.` (root)
7. Click **"Advanced"** and add Environment Variables:
   - `GEMINI_API_KEY` = your_api_key_here
   - `FLASK_ENV` = `production`
8. Click **"Deploy"**
9. Your app will be live at: `https://your-site-name.netlify.app`

### Troubleshooting Netlify:
- Flask may have compatibility issues with Netlify's serverless functions
- Vercel is recommended for Flask applications
- If having issues, try Vercel instead

---

## ⚙️ Update Environment Variables After Deployment

### For Vercel:
1. Go to your project dashboard
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Update `GEMINI_API_KEY` if needed

### For Netlify:
1. Go to your site settings
2. Click **"Build & Deploy"** → **"Environment"**
3. Click **"Edit Variables"**
4. Update `GEMINI_API_KEY` if needed

---

## 🧪 Test Your Deployment

After deployment, open your app URL and:
1. Navigate to the home page
2. Enter some text in the input field
3. Select a correction mode and subtype
4. Click submit and verify it corrects the text

---

## 📋 Project Structure

```
FluencyFlow/
├── main.py                 # Flask app (updated to use .env)
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (NOT in GitHub)
├── .gitignore             # Git ignore file
├── vercel.json            # Vercel deployment config
├── netlify.toml           # Netlify deployment config
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── templates/
    └── index.html
```

---

## 🔑 Important Security Notes

1. **NEVER hardcode API keys** in your code
2. **ALWAYS use `.env` files** for sensitive data
3. **ALWAYS add `.env` to `.gitignore`** before pushing to GitHub
4. Set environment variables in deployment platform's dashboard
5. Rotate API keys regularly if compromised

---

## 🛠️ Local Testing Before Deployment

Before deploying, test locally:

```powershell
# Install dependencies
pip install -r requirements.txt

# Run the app
python main.py

# Visit http://localhost:5000
```

Make sure everything works locally before deploying!

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Flask Docs: https://flask.palletsprojects.com

