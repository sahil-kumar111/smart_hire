import json
import logging

logger = logging.getLogger(__name__)


def extract_json(raw_text: str, default=None):
    """
    Extracts and parses JSON from raw LLM output even if surrounded by markdown
    code fences (```json ... ```), nested backticks in strings, or conversational text.
    """
    if not raw_text or not raw_text.strip():
        if default is not None:
            return default
        raise ValueError("Empty response received from LLM.")

    text = raw_text.strip()

    # 1. Try direct parse first
    try:
        return json.loads(text, strict=False)
    except json.JSONDecodeError:
        pass

    # 2. Extract outermost JSON object or array from raw text
    object_start = text.find("{")
    object_end = text.rfind("}")

    array_start = text.find("[")
    array_end = text.rfind("]")

    # Decide whether outer structure is an array or an object
    is_array = False
    if array_start != -1 and array_end != -1:
        if object_start == -1 or array_start < object_start:
            is_array = True

    if is_array and array_start != -1 and array_end > array_start:
        candidate = text[array_start : array_end + 1]
        try:
            return json.loads(candidate, strict=False)
        except json.JSONDecodeError:
            pass

    if object_start != -1 and object_end > object_start:
        candidate = text[object_start : object_end + 1]
        try:
            return json.loads(candidate, strict=False)
        except json.JSONDecodeError:
            pass

    # 3. Strip outer ```json or ``` if wrapped as a whole block
    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 2 and lines[0].startswith("```") and lines[-1].startswith("```"):
            inner = "\n".join(lines[1:-1]).strip()
            try:
                return json.loads(inner, strict=False)
            except json.JSONDecodeError:
                pass

    if default is not None:
        logger.warning("Failed to parse JSON from LLM output, using fallback default.")
        return default

    raise ValueError(f"Could not parse valid JSON from text: {text[:200]}")
