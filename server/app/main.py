import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.parser import parse_resume as parse_pdf_resume
import os
from app.core.chroma_config import get_client
from server.scripts.build_emb import build_chroma


def initialize_chroma():
    client = get_client()
    try:
        client.get_collection(name="courses")
        print("Chroma collection already exists")
    except Exception:
        print("Building Chroma collection...")
        build_chroma()


@asynccontextmanager
async def lifespan(app: FastAPI):
    threading.Thread(
        target=initialize_chroma,
        daemon=True
    ).start()
    yield


app = FastAPI(title="AI Microservice", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"status": "Python Microservice Running"}


from app.routes.resume_route import router as resume_router
from app.routes.courses_route import router as courses_router
from app.routes.roadmap_route import router as roadmap_router
from app.routes.interview_route import router as interview_router

app.include_router(resume_router)
app.include_router(courses_router)
app.include_router(roadmap_router)
app.include_router(interview_router)