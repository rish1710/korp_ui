import json
import re
import hashlib
import os
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Cache directory for LLM responses
CACHE_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "llm_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

_client = None

def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.getenv("GROQ_API_KEY"),
        )
    return _client

def _get_cache_key(system_prompt: str, user_prompt: str, model: str) -> str:
    combined = f"{model}:{system_prompt}:{user_prompt}"
    return hashlib.md5(combined.encode()).hexdigest()

def _get_cached_response(cache_key: str) -> str | None:
    cache_file = CACHE_DIR / f"{cache_key}.txt"
    if cache_file.exists():
        try:
            return cache_file.read_text(encoding="utf-8")
        except:
            return None
    return None

def _save_to_cache(cache_key: str, content: str):
    try:
        cache_file = CACHE_DIR / f"{cache_key}.txt"
        cache_file.write_text(content, encoding="utf-8")
    except Exception as e:
        print(f"[CACHE WARNING] {e}")

def _extract_json(text: str) -> dict:
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"```(?:json)?\s*\n?(.*?)```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    return {}

def llm_json(system_prompt: str, user_prompt: str, model: str = "llama-3.3-70b-versatile") -> dict:
    cache_key = _get_cache_key(system_prompt, user_prompt, model)
    cached = _get_cached_response(cache_key)
    if cached:
        return _extract_json(cached)

    client = get_client()
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        raw = resp.choices[0].message.content or ""
        _save_to_cache(cache_key, raw)
        return _extract_json(raw)
    except Exception as e:
        print(f"[LLM ERROR] {e}")
        return {}

def llm_text(system_prompt: str, user_prompt: str, model: str = "llama-3.3-70b-versatile") -> str:
    cache_key = _get_cache_key(system_prompt, user_prompt, model)
    cached = _get_cached_response(cache_key)
    if cached:
        return cached

    client = get_client()
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        content = resp.choices[0].message.content or ""
        _save_to_cache(cache_key, content)
        return content
    except Exception as e:
        print(f"[LLM ERROR] {e}")
        return ""
