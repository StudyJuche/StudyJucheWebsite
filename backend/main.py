from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from database import create_db_and_tables, get_session
from models import Course, CourseLesson, UserLessonProgress, UserCourseProgress, User, CourseBase, CourseLessonCreate, CourseReadWithLessons
import models
import os
from typing import List
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/api")
def read_root():
    return {"Hello": "World"}

# --- MOCK AUTHENTICATION ---
def get_current_user(session: Session = Depends(get_session)) -> User:
    user = session.get(User, 1)
    if not user:
        user = User(id=1, username="testuser", email="test@example.com", hashed_password="mockpassword")
        session.add(user)
        session.commit()
        session.refresh(user)
    return user

# --- GHOST PROXY ENDPOINT ---
GHOST_URL = os.getenv("VITE_GHOST_URL")
GHOST_CONTENT_KEY = os.getenv("VITE_GHOST_CONTENT_KEY")

@app.get("/api/ghost/posts")
def get_ghost_posts_for_admin():
    """Fetches all posts from Ghost CMS that are tagged as lessons for admin purposes."""
    if not GHOST_URL or not GHOST_CONTENT_KEY:
        raise HTTPException(status_code=500, detail="Ghost URL or Content API Key not configured.")
    
    # Filter for posts that HAVE the internal #lesson tag
    filter = "tag:hash-lesson"
    ghost_api_url = f"{GHOST_URL}/ghost/api/content/posts/?key={GHOST_CONTENT_KEY}&limit=all&fields=id,title,slug&filter={filter}"
    
    try:
        response = requests.get(ghost_api_url)
        response.raise_for_status()
        return response.json().get("posts", [])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch posts from Ghost: {e}")

# --- COURSES ENDPOINTS ---

@app.post("/api/courses", response_model=Course)
def create_course(course: CourseBase, session: Session = Depends(get_session)):
    db_course = Course.model_validate(course)
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@app.delete("/api/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Manually delete associated lessons first
    lessons = session.exec(select(CourseLesson).where(CourseLesson.course_id == course_id)).all()
    for lesson in lessons:
        session.delete(lesson)
        
    session.delete(course)
    session.commit()
    return

@app.post("/api/courses/{course_id}/lessons", response_model=CourseLesson)
def add_lesson_to_course(course_id: int, lesson: CourseLessonCreate, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db_lesson = CourseLesson.model_validate(lesson, update={"course_id": course_id})
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)
    return db_lesson

@app.delete("/api/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson(lesson_id: int, session: Session = Depends(get_session)):
    lesson = session.get(CourseLesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    session.delete(lesson)
    session.commit()
    return

@app.get("/api/courses", response_model=List[CourseReadWithLessons])
def get_courses(session: Session = Depends(get_session)):
    courses = session.exec(select(Course).options(selectinload(Course.lessons))).all()
    return courses

@app.get("/api/courses/{slug}")
def get_course_details(slug: str, session: Session = Depends(get_session)):
    course = session.exec(select(Course).where(Course.slug == slug)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lessons = session.exec(select(CourseLesson).where(CourseLesson.course_id == course.id).order_by(CourseLesson.order)).all()
    
    return {"course": course, "lessons": lessons}

# --- PROGRESS ENDPOINTS ---

@app.get("/api/progress/course/{course_id}")
def get_user_course_progress(course_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    course_lessons = session.exec(select(CourseLesson).where(CourseLesson.course_id == course_id).order_by(CourseLesson.order)).all()
    completed_progress = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.is_completed == True)).all()
    completed_slugs = {p.ghost_post_slug for p in completed_progress}
    
    completed_count = sum(1 for lesson in course_lessons if lesson.ghost_post_slug in completed_slugs)
    total_lessons = len(course_lessons)
    percent_complete = (completed_count / total_lessons * 100) if total_lessons > 0 else 0
    
    lesson_progress = [
        {
            "lesson_id": lesson.id,
            "ghost_post_slug": lesson.ghost_post_slug,
            "is_completed": lesson.ghost_post_slug in completed_slugs,
            "order": lesson.order
        } for lesson in course_lessons
    ]
    
    return {
        "total_lessons": total_lessons,
        "completed_lessons": completed_count,
        "percent_complete": percent_complete,
        "lesson_progress": lesson_progress
    }

@app.post("/api/progress/lesson/{ghost_post_slug}/complete")
def mark_lesson_complete(ghost_post_slug: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    existing_progress = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.ghost_post_slug == ghost_post_slug)).first()
    
    if existing_progress:
        if not existing_progress.is_completed:
            existing_progress.is_completed = True
            session.add(existing_progress)
            session.commit()
        return {"status": "success", "message": "Lesson marked as complete", "is_completed": True}
    
    new_progress = UserLessonProgress(user_id=current_user.id, ghost_post_slug=ghost_post_slug, is_completed=True)
    session.add(new_progress)
    session.commit()
    
    return {"status": "success", "message": "Lesson marked as complete", "is_completed": True}

# --- SEED ENDPOINT ---

@app.post("/api/dev/seed-courses")
def seed_courses(session: Session = Depends(get_session)):
    if session.exec(select(Course).where(Course.slug == "intro-to-juche")).first():
        return {"message": "Data already seeded"}
        
    course = Course(title="Introduction to the Juche Idea", description="A foundational course on the core principles of Juche.", slug="intro-to-juche")
    session.add(course)
    session.commit()
    session.refresh(course)
    
    lessons = [
        CourseLesson(course_id=course.id, ghost_post_slug="lesson-1-philosophical-principles", order=1),
        CourseLesson(course_id=course.id, ghost_post_slug="lesson-2-socio-historical-principles", order=2),
        CourseLesson(course_id=course.id, ghost_post_slug="lesson-3-guiding-principles", order=3)
    ]
    session.add_all(lessons)
    session.commit()
    
    return {"message": "Seeded 1 course with 3 lessons successfully."}
