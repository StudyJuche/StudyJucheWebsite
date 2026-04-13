from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from database import create_db_and_tables, get_session, engine
from models import (
    Course, CourseLesson, User, UserRole, CourseBase, CourseLessonCreate, 
    CourseReadWithLessons, UserCreate, UserRead, UserLessonProgress, CourseProgress, CourseRead, UserCourseProgress
)
import security
import os
import shutil
from typing import List, Optional
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload
import feedparser
import time
from datetime import datetime

load_dotenv()

def create_admin_user(session: Session):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "password")

    user = session.exec(select(User).where(User.username == admin_username)).first()
    if not user:
        hashed_password = security.pwd_context.hash(admin_password, scheme="argon2")
        admin_user = User(
            username=admin_username,
            email=admin_email,
            hashed_password=hashed_password,
            role=UserRole.admin,
            is_verified=True
        )
        session.add(admin_user)
        session.commit()
        print("Admin user created with argon2 hash.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("static/images/courses", exist_ok=True)
    create_db_and_tables()
    with Session(engine) as session:
        create_admin_user(session)
    yield

app = FastAPI(lifespan=lifespan)

# --- Static Files & Basic Routes ---
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Authentication Endpoints ---
@app.post("/token", tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = security.create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=UserRead, tags=["Authentication"])
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where((User.username == user.username) | (User.email == user.email))).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = security.get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

# --- User Endpoints ---
@app.get("/users/me", response_model=UserRead, tags=["Users"])
async def read_users_me(current_user: User = Depends(security.get_current_user)):
    return current_user

@app.get("/api/users/me/continue-learning", response_model=Optional[CourseRead], tags=["Users"])
def get_continue_learning_course(current_user: User = Depends(security.get_current_user), session: Session = Depends(get_session)):
    progress = session.exec(select(UserCourseProgress).where(UserCourseProgress.user_id == current_user.id, UserCourseProgress.is_completed == False).order_by(UserCourseProgress.last_accessed_at.desc())).first()
    if not progress: return None
    return session.get(Course, progress.course_id)

@app.get("/api/users/me/overall-progress", tags=["Users"])
def get_overall_progress(current_user: User = Depends(security.get_current_user), session: Session = Depends(get_session)):
    total_lessons = session.exec(select(CourseLesson)).all()
    if not total_lessons: return {"total": 0, "completed": 0, "percentage": 0}
    completed_lessons = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.is_completed == True)).all()
    return {"total": len(total_lessons), "completed": len(completed_lessons), "percentage": (len(completed_lessons) / len(total_lessons) * 100) if total_lessons else 0}

# --- Progress Endpoints ---
@app.get("/api/progress/course/{course_id}", response_model=CourseProgress, tags=["Users"])
def get_user_course_progress(course_id: int, current_user: User = Depends(security.get_current_user), session: Session = Depends(get_session)):
    course_lessons = session.exec(select(CourseLesson).where(CourseLesson.course_id == course_id)).all()
    if not course_lessons: return {"total_lessons": 0, "completed_lessons": 0, "percent_complete": 0, "lesson_progress": []}
    completed_slugs = {p.ghost_post_slug for p in session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.is_completed == True)).all()}
    completed_count = sum(1 for lesson in course_lessons if lesson.ghost_post_slug in completed_slugs)
    return {"total_lessons": len(course_lessons), "completed_lessons": completed_count, "percent_complete": (completed_count / len(course_lessons) * 100) if course_lessons else 0, "lesson_progress": [{"lesson_id": lesson.id, "ghost_post_slug": lesson.ghost_post_slug, "is_completed": lesson.ghost_post_slug in completed_slugs, "order": lesson.order} for lesson in course_lessons]}

@app.post("/api/progress/lesson/{ghost_post_slug}/complete", tags=["Users"])
def mark_lesson_complete(ghost_post_slug: str, current_user: User = Depends(security.get_current_user), session: Session = Depends(get_session)):
    lesson = session.exec(select(CourseLesson).where(CourseLesson.ghost_post_slug == ghost_post_slug)).first()
    if lesson:
        course_progress = session.exec(select(UserCourseProgress).where(UserCourseProgress.user_id == current_user.id, UserCourseProgress.course_id == lesson.course_id)).first()
        if course_progress: course_progress.last_accessed_at = datetime.utcnow()
        else: course_progress = UserCourseProgress(user_id=current_user.id, course_id=lesson.course_id)
        session.add(course_progress)
    
    lesson_progress = session.exec(select(UserLessonProgress).where(UserLessonProgress.user_id == current_user.id, UserLessonProgress.ghost_post_slug == ghost_post_slug)).first()
    if not lesson_progress: lesson_progress = UserLessonProgress(user_id=current_user.id, ghost_post_slug=ghost_post_slug)
    lesson_progress.is_completed = True
    session.add(lesson_progress)
    session.commit()
    return {"status": "success"}

# --- Admin Endpoints ---
@app.get("/api/ghost/posts", tags=["Admin"])
def get_ghost_posts_for_admin(user: User = Depends(security.require_moderator)):
    GHOST_URL, GHOST_CONTENT_KEY = os.getenv("VITE_GHOST_URL"), os.getenv("VITE_GHOST_CONTENT_KEY")
    if not GHOST_URL or not GHOST_CONTENT_KEY: raise HTTPException(status_code=500, detail="Ghost env vars not set.")
    try:
        res = requests.get(f"{GHOST_URL}/ghost/api/content/posts/?key={GHOST_CONTENT_KEY}&limit=all&fields=id,title,slug&filter=tag:hash-lesson")
        res.raise_for_status()
        return res.json().get("posts", [])
    except requests.exceptions.RequestException as e: raise HTTPException(status_code=500, detail=f"Failed to fetch from Ghost: {e}")

@app.post("/api/courses", response_model=Course, tags=["Admin"])
def create_course(title: str = Form(...), description: str = Form(...), slug: str = Form(...), file: UploadFile = File(...), session: Session = Depends(get_session), user: User = Depends(security.require_moderator)):
    file_path = f"static/images/courses/{file.filename}"
    with open(file_path, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    db_course = Course.model_validate(CourseBase(title=title, description=description, slug=slug, feature_image_url=f"/{file_path}"))
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@app.delete("/api/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin"])
def delete_course(course_id: int, session: Session = Depends(get_session), user: User = Depends(security.require_admin)):
    course = session.get(Course, course_id)
    if not course: raise HTTPException(status_code=404, detail="Course not found")
    for lesson in session.exec(select(CourseLesson).where(CourseLesson.course_id == course_id)).all(): session.delete(lesson)
    session.delete(course)
    session.commit()

@app.post("/api/courses/{course_id}/lessons", response_model=CourseLesson, tags=["Admin"])
def add_lesson_to_course(course_id: int, lesson: CourseLessonCreate, session: Session = Depends(get_session), user: User = Depends(security.require_moderator)):
    if not session.get(Course, course_id): raise HTTPException(status_code=404, detail="Course not found")
    db_lesson = CourseLesson.model_validate(lesson, update={"course_id": course_id})
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)
    return db_lesson

@app.delete("/api/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Admin"])
def delete_lesson(lesson_id: int, session: Session = Depends(get_session), user: User = Depends(security.require_moderator)):
    lesson = session.get(CourseLesson, lesson_id)
    if not lesson: raise HTTPException(status_code=404, detail="Lesson not found")
    session.delete(lesson)
    session.commit()

# --- Public Endpoints ---
@app.get("/api/courses", response_model=List[CourseReadWithLessons], tags=["Public"])
def get_courses(session: Session = Depends(get_session)):
    return session.exec(select(Course).options(selectinload(Course.lessons))).all()

@app.get("/api/courses/{slug}", tags=["Public"])
def get_course_details(slug: str, session: Session = Depends(get_session)):
    course = session.exec(select(Course).where(Course.slug == slug)).first()
    if not course: raise HTTPException(status_code=404, detail="Course not found")
    lessons = session.exec(select(CourseLesson).where(CourseLesson.course_id == course.id).order_by(CourseLesson.order)).all()
    return {"course": course, "lessons": lessons}

# --- YOUTUBE FEED ENDPOINT ---
youtube_cache = {"timestamp": 0, "videos": []}
CACHE_DURATION = 3600
@app.get("/api/youtube/latest", tags=["Public"])
def get_latest_youtube_videos():
    now = time.time()
    if now - youtube_cache["timestamp"] < CACHE_DURATION and youtube_cache["videos"]: return youtube_cache["videos"]
    try:
        feed = feedparser.parse(f"https://www.youtube.com/feeds/videos.xml?channel_id=UCnsmyPvWfq7XAnRmmMwKu2g")
        videos = [{"id": entry.yt_videoid, "title": entry.title, "link": entry.link, "thumbnail": f"https://i.ytimg.com/vi/{entry.yt_videoid}/hqdefault.jpg"} for entry in feed.entries[:4]]
        youtube_cache.update({"timestamp": now, "videos": videos})
        return videos
    except Exception as e: raise HTTPException(status_code=500, detail=f"Failed to parse YouTube RSS feed: {e}")
