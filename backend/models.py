from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

# --- Base Models (for creating data) ---
class CourseBase(SQLModel):
    title: str
    description: str
    slug: str

class CourseLessonCreate(SQLModel):
    ghost_post_slug: str
    order: int

# --- Database Table Models ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    course_progress: List["UserCourseProgress"] = Relationship(back_populates="user")
    lesson_progress: List["UserLessonProgress"] = Relationship(back_populates="user")

class Course(CourseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    lessons: List["CourseLesson"] = Relationship(back_populates="course")
    user_progress: List["UserCourseProgress"] = Relationship(back_populates="course")

class CourseLesson(CourseLessonCreate, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id")
    course: "Course" = Relationship(back_populates="lessons")

class UserCourseProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    is_completed: bool = Field(default=False)
    user: "User" = Relationship(back_populates="course_progress")
    course: "Course" = Relationship(back_populates="user_progress")

class UserLessonProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    ghost_post_slug: str
    is_completed: bool = Field(default=False)
    user: "User" = Relationship(back_populates="lesson_progress")

# --- API "Read" Models (for sending data out) ---
class CourseLessonRead(CourseLessonCreate):
    id: int

class CourseRead(CourseBase):
    id: int

class CourseReadWithLessons(CourseRead):
    lessons: List[CourseLessonRead] = []
