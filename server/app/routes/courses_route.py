from app.controllers.courses_controller import rec_courses
from fastapi import APIRouter

router=APIRouter(
    prefix="/api1", 
    tags=["courses recommendation"]
)

@router.get("/get_courses")
async def rec_courses_route(query: str, k: int = 4):
    return await rec_courses(query, k)
