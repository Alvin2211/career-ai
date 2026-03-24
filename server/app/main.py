from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.parser import parse_resume as parse_pdf_resume
import os
app = FastAPI(title="AI Microservice")

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

app.include_router(resume_router)
app.include_router(courses_router)

    