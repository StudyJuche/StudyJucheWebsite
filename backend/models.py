from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    admin = "admin"
    moderator = "moderator"
    student = "student"

# --- Base Models ---
class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)

class UserCreate(UserBase):
    password: str

class CourseBase(SQLModel):
    title: str
    description: str
    slug: str
    feature_image_url: str

class CourseLessonCreate(SQLModel):
    ghost_post_slug: str
    order: int

# --- API "Read" Models ---
class UserRead(UserBase):
    id: int
    role: UserRole
    is_verified: bool

class CourseLessonRead(CourseLessonCreate):
    id: int

class CourseRead(CourseBase):
    id: int

class CourseReadWithLessons(CourseRead):
    lessons: List[CourseLessonRead] = []

class LessonProgress(SQLModel):
    lesson_id: int
    ghost_post_slug: str
    is_completed: bool
    order: int

class CourseProgress(SQLModel):
    total_lessons: int
    completed_lessons: int
    percent_complete: float
    lesson_progress: List[LessonProgress]

# --- Database Table Models ---
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    role: UserRole = Field(default=UserRole.student)
    is_verified: bool = Field(default=False)
    
    course_progress: List["UserCourseProgress"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    lesson_progress: List["UserLessonProgress"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class Course(CourseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    
    lessons: List["CourseLesson"] = Relationship(back_populates="course", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    user_progress: List["UserCourseProgress"] = Relationship(back_populates="course", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class CourseLesson(CourseLessonCreate, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id")
    course: "Course" = Relationship(back_populates="lessons")

class UserCourseProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    is_completed: bool = Field(default=False)
    last_accessed_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    
    user: "User" = Relationship(back_populates="course_progress")
    course: "Course" = Relationship(back_populates="user_progress")

class UserLessonProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    ghost_post_slug: str
    is_completed: bool = Field(default=False)

    user: "User" = Relationship(back_populates="lesson_progress")
