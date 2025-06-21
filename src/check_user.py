from app import app
from api.models import db, User

with app.app_context():
    user = User.query.get(1)
    print(user)
