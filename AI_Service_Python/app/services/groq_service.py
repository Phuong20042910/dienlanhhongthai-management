import requests
from typing import Optional, List
from app.config import settings

class GroqService:
    """Service goi Groq AI API - du phong cho Gemini"""
    
    def __init__(self):
        raw_key = getattr(settings, 'GROQ_API_KEY', '') or ''
        self.api_key = raw_key.strip().strip('"').strip("'")
        self._available_models: Optional[List[str]] = None
    
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key not in ("", "your_groq_api_key_here"))

    def _get_available_models(self) -> List[str]:
        """Lay danh sach model dang hoat dong tu Groq API"""
        if self._available_models is not None:
            return self._available_models
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            res = requests.get("https://api.groq.com/openai/v1/models", headers=headers, timeout=10)
            if res.status_code == 200:
                models = res.json().get("data", [])
                # Chi lay model text (khong phai whisper/vision)
                model_ids = [
                    m["id"] for m in models
                    if not any(x in m["id"] for x in ["whisper", "vision", "guard"])
                ]
                print(f"Groq models available: {len(model_ids)} models")
                self._available_models = model_ids
                return model_ids
        except Exception as e:
            print(f"Groq list models error: {e}")
        
        # Fallback neu khong lay duoc list
        return ["llama3-8b-8192", "gemma2-9b-it"]

    def call(self, prompt: str) -> Optional[dict]:
        """
        Goi Groq API, tu dong lay danh sach model kha dung roi thu tung cai.
        Tra ve ket qua theo dinh dang Gemini de code khac tai su dung.
        """
        if not self.is_configured():
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        models = self._get_available_models()
        if not models:
            print("Groq: no available models found")
            return None

        for model in models:
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "max_tokens": 4096,
            }
            try:
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=25
                )
                if res.status_code == 200:
                    text = res.json()['choices'][0]['message']['content']
                    print(f"Groq OK [{model}]")
                    return {
                        "candidates": [
                            {"content": {"parts": [{"text": text}]}}
                        ]
                    }
                else:
                    error_code = res.json().get("error", {}).get("code", "")
                    print(f"Groq SKIP [{model}]: {error_code}")
                    if error_code in ("model_decommissioned", "model_not_found", "invalid_request_error"):
                        # Xoa khoi cache de lan sau khong thu lai
                        if self._available_models and model in self._available_models:
                            self._available_models.remove(model)
                        continue
                    break

            except Exception:
                print(f"Groq ERROR [{model}]: connection failed")
                break

        return None


groq_service = GroqService()
