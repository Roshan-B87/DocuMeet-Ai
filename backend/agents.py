"""
agents.py — Multi-agent debate orchestration for DocuMeet AI.

Flow:
  Round 1  → Each agent gives its perspective on the user's question.
  Round 2  → Each agent reads the others' Round 1 responses and rebuts/builds.
  Synthesis → A Moderator agent reads all rounds and produces a final answer.
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
)

MODEL = "openai/gpt-oss-120b"
MAX_TOKENS = 2048
TEMPERATURE = 0.8

AGENT_COLORS = ["cyan", "violet", "emerald"]


def _call_model(system_prompt: str, user_prompt: str) -> dict:
    """
    Call the NVIDIA NIM model and return both reasoning and content.
    Returns a dict: {"reasoning": str | None, "content": str}
    """
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=TEMPERATURE,
        top_p=1,
        max_tokens=MAX_TOKENS,
        stream=False,
    )
    message = completion.choices[0].message
    reasoning = getattr(message, "reasoning_content", None)
    content = message.content or ""
    return {"reasoning": reasoning, "content": content}


def run_debate(agents: list[dict], question: str) -> dict:
    """
    Run a 2-round debate + synthesis for the given agents and question.

    Args:
        agents: List of {"name": str, "text": str} dicts (max 3)
        question: The user's question/topic

    Returns:
        A structured dict with all rounds and synthesis
    """
    results = {
        "question": question,
        "agents": [{"name": a["name"], "color": AGENT_COLORS[i]} for i, a in enumerate(agents)],
        "rounds": [],
        "synthesis": None,
    }

    # ──────────────────────────────────────────────
    # ROUND 1 — Each agent gives its first perspective
    # ──────────────────────────────────────────────
    round1_responses = []
    for i, agent in enumerate(agents):
        color = AGENT_COLORS[i]
        system_prompt = (
            f"You are '{agent['name']}', an AI persona representing the document provided to you. "
            f"Your role is to analyze the document and answer the user's question from the perspective "
            f"of its content. Be insightful, specific, and reference key points from your document. "
            f"Keep your response focused and under 300 words."
        )
        user_prompt = (
            f"DOCUMENT CONTENT:\n{agent['text'][:6000]}\n\n"
            f"USER QUESTION: {question}\n\n"
            f"Provide your perspective on this question based solely on your document."
        )
        response = _call_model(system_prompt, user_prompt)
        round1_responses.append({
            "agent_name": agent["name"],
            "agent_color": color,
            "reasoning": response["reasoning"],
            "content": response["content"],
        })

    results["rounds"].append({"round_number": 1, "label": "Opening Perspectives", "messages": round1_responses})

    # ──────────────────────────────────────────────
    # ROUND 2 — Each agent rebuts and builds on others
    # ──────────────────────────────────────────────
    # Compose a summary of all Round 1 responses to share with each agent
    r1_summary = "\n\n".join(
        [f"[{r['agent_name']}]: {r['content']}" for r in round1_responses]
    )

    round2_responses = []
    for i, agent in enumerate(agents):
        color = AGENT_COLORS[i]
        system_prompt = (
            f"You are '{agent['name']}', an AI persona representing the document provided to you. "
            f"You have just heard other agents share their perspectives. "
            f"Now you must respond: agree with valid points, challenge incorrect assumptions, and "
            f"add new insights from your own document. Be direct, analytical, and under 250 words."
        )
        user_prompt = (
            f"ORIGINAL QUESTION: {question}\n\n"
            f"YOUR DOCUMENT CONTENT:\n{agent['text'][:4000]}\n\n"
            f"OTHER AGENTS' ROUND 1 RESPONSES:\n{r1_summary}\n\n"
            f"Provide your rebuttal and build on the discussion."
        )
        response = _call_model(system_prompt, user_prompt)
        round2_responses.append({
            "agent_name": agent["name"],
            "agent_color": color,
            "reasoning": response["reasoning"],
            "content": response["content"],
        })

    results["rounds"].append({"round_number": 2, "label": "Rebuttals & Deep Dive", "messages": round2_responses})

    # ──────────────────────────────────────────────
    # SYNTHESIS — Moderator agent produces final answer
    # ──────────────────────────────────────────────
    r2_summary = "\n\n".join(
        [f"[{r['agent_name']}]: {r['content']}" for r in round2_responses]
    )
    all_debate = f"ROUND 1:\n{r1_summary}\n\nROUND 2:\n{r2_summary}"

    synthesis_system = (
        "You are the Moderator of a multi-agent debate. "
        "Your role is to synthesize the insights from all agents into a single, coherent, "
        "balanced final answer to the user's original question. "
        "Highlight key agreements, important disagreements, and a clear recommendation. "
        "Be authoritative, clear, and under 400 words."
    )
    synthesis_user = (
        f"ORIGINAL QUESTION: {question}\n\n"
        f"FULL DEBATE TRANSCRIPT:\n{all_debate}\n\n"
        f"Produce the final synthesis and recommendation."
    )
    synthesis_response = _call_model(synthesis_system, synthesis_user)
    results["synthesis"] = {
        "reasoning": synthesis_response["reasoning"],
        "content": synthesis_response["content"],
    }

    return results
