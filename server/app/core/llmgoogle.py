from app.core.gemini_config import settings
from langchain_google_genai import ChatGoogleGenerativeAI
    
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0.7,
)