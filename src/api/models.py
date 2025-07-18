from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Add relationship to posts
    posts: Mapped[list["Post"]] = relationship(
        "Post", back_populates="user", cascade="all, delete-orphan")
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="posts")
    images: Mapped[list["PostImage"]] = relationship(
        "PostImage", back_populates="post", cascade="all, delete-orphan")
    # do not serialize the password, its a securitdely breach

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
            },
            "images": [img.serialize() for img in self.images]
        }

    # def __init__(self, data, user):
    #     if data:
    #         self.title = data.get("title")
    #         self.content = data.get("content")
    #     else:
    #         self.title = None
    #         self.content = None

    #     if user:
    #         self.user = user
    #     elif data and data.get("user_id"):
    #         self.user_id = data.get("user_id")


class Message(db.Model):
    __tablename__ = "message"
    id: Mapped[int] = mapped_column(primary_key=True)
    message_name: Mapped[str] = mapped_column(String(120), nullable=False)
    message_email:  Mapped[str] = mapped_column(
        String(120), nullable=False)
    content: Mapped[str] = mapped_column(
        String(120), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    user: Mapped["User"] = relationship("User", back_populates="messages")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "message_name": self.message_name,
            "message_email": self.message_email,
        }


class PostImage(db.Model):
    __tablename__ = "post_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(nullable=False)

    # Relationship back to Post
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), nullable=False)
    post: Mapped["Post"] = relationship("Post", back_populates="images")

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "post_id": self.post_id
        }
