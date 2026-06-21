# DocuMeet AI

> Multi-agent document debate powered by NVIDIA NIM

Upload 2–3 documents, assign them AI personas, and watch them argue, collaborate, and synthesize answers to your questions — against a stunning starry backdrop.

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
Health check: `http://localhost:8000/health`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📁 Project Structure

```
AI_Bed/
├── backend/
│   ├── main.py          # FastAPI endpoints
│   ├── agents.py        # Multi-agent debate logic
│   ├── parser.py        # PDF/TXT text extraction
│   ├── requirements.txt
│   └── .env             # NVIDIA_API_KEY (never commit!)
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Page 1: Landing
    │   ├── setup/page.tsx   # Page 2: Setup
    │   └── debate/page.tsx  # Page 3: Debate Arena
    └── components/ui/
        ├── shooting-stars.tsx
        └── stars-background.tsx
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| POST | `/upload` | Upload 2–3 PDF/TXT files → returns extracted text |
| POST | `/debate` | Run 2-round debate + synthesis → returns full results |

---

## 🎨 Features

- **3-page app**: Landing → Setup → Debate Arena
- **Aceternity UI**: Shooting stars + twinkling star background
- **Document upload**: PDF and TXT, 2–3 files
- **User-defined personas**: Name each agent yourself
- **2 debate rounds**: Opening perspectives + Rebuttals
- **Thinking panels**: See the AI's `reasoning_content` before answers
- **Final synthesis**: Moderator AI produces unified conclusion
- **Glassmorphism UI**: Dark mode with agent-colored glow effects
