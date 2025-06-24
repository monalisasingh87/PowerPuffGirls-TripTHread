from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a securitdely breach
        }


class Message(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    message_name: Mapped[str] = mapped_column(String(120), nullable=False)
    message_email:  Mapped[str] = mapped_column(
        String(120), nullable=False)
    content: Mapped[str] = mapped_column(
        String(120), nullable=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=True)
    user: Mapped["User"] = relationship("User", back_populates="messages")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "message_name": self.message_name,
            "message_email": self.message_email,

        }
