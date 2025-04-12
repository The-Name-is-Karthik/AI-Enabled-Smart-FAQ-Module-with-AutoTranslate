from dotenv import load_dotenv
from typing import List
from google.cloud import translate_v2 as translate

# Load the environment variables
load_dotenv()

# Initialize Google Translate API
# automatically checks for `GOOGLE_APPLICATION_CREDENTIALS` .env variable --> make sure to declare this
# e.g. GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-file.json"
translate_client = translate.Client()

# Supported languages
SUPPORTED_LANGUAGES = {
    'en': 'English',
    'hi': 'Hindi',
    'es': 'Spanish',
    'de': 'German'
}

def detect_language(text: str) -> str:
    """
    Detects the language of the given text among English, Hindi, and Spanish.
    Returns the language code.
    """
    result = translate_client.detect_language(text)
    language = result['language']
    if language not in SUPPORTED_LANGUAGES:
        # Default to English if not among supported languages
        return 'en'
    return language

def translate_text(text: str, target_language: str) -> str:
    """
    Translates text to the target language.
    """
    result = translate_client.translate(text, target_language=target_language)
    return result['translatedText']

def batch_translate_texts(texts: List[str], target_language: str) -> List[str]:
    """
    Translates a list of texts to the target language.
    """
    results = translate_client.translate(texts, target_language=target_language)
    translated_texts = [res['translatedText'] for res in results]
    return translated_texts