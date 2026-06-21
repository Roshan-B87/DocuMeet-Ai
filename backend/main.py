"""
main.py — FastAPI entry point for DocuMeet AI backend.

Endpoints:
  GET  /health   — Health check
  POST /upload   — Upload 2-3 documents (PDF/TXT), extract text
  POST /debate   — Run the multi-agent debate and return results
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated
import json

from parser import extract_text_from_file
from agents import run_debate

app = FastAPI(
    title="DocuMeet AI API",
    description="Multi-agent document debate powered by NVIDIA NIM",
    version="1.0.0",
)

# ── CORS — allow the Next.js frontend (dev: localhost:3000) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "DocuMeet AI"}


# ─────────────────────────────────────────────────────────────
# Upload Endpoint
# ─────────────────────────────────────────────────────────────

@app.post("/upload")
async def upload_documents(
    files: Annotated[list[UploadFile], File(description="2 to 3 PDF or TXT documents")],
):
    """
    Accept 2-3 uploaded files, extract their text, and return it.
    The frontend stores this text in session state for the debate.
    """
    if len(files) < 2 or len(files) > 3:
        raise HTTPException(
            status_code=400,
            detail="Please upload between 2 and 3 documents.",
        )

    extracted = []
    for file in files:
        if not (file.filename.endswith(".pdf") or file.filename.endswith(".txt")):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.filename}. Only PDF and TXT are allowed.",
            )
        content = await file.read()
        try:
            text = extract_text_from_file(file.filename, content)
        except Exception as e:
            raise HTTPException(
                status_code=422,
                detail=f"Failed to extract text from {file.filename}: {str(e)}",
            )
        extracted.append({
            "filename": file.filename,
            "size_bytes": len(content),
            "text_preview": text[:500],  # First 500 chars for preview
            "full_text": text,
        })

    return {"documents": extracted}


# ─────────────────────────────────────────────────────────────
# Debate Endpoint
# ─────────────────────────────────────────────────────────────

class DebateRequest(BaseModel):
    agents: list[dict]  # [{"name": str, "text": str}, ...]
    question: str


@app.post("/debate")
async def start_debate(request: DebateRequest):
    """
    Run the full multi-agent debate:
      - Round 1: Opening perspectives
      - Round 2: Rebuttals & deep dive
      - Synthesis: Moderator final answer
    """
    if len(request.agents) < 2 or len(request.agents) > 3:
        raise HTTPException(
            status_code=400,
            detail="Debate requires 2 to 3 agents.",
        )
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:
        result = run_debate(request.agents, request.question)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Debate failed: {str(e)}",
        )

    return result
