import click
from api.models import db, User, Post

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator.
Flask commands are useful to run cron jobs or tasks outside the API but still integrated
with your database, for example: Import the price of bitcoin every night at 12am.
"""

def setup_commands(app):

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users...")
        for x in range(1, int(count) + 1):
            user = User(
                email=f"test_user{x}@test.com",
                password="123456",
                is_active=True
            )
            db.session.add(user)
        db.session.commit()
        print(f"{count} test users created.")

    @app.cli.command("create-user-with-posts")
    @click.argument("email")
    @click.argument("num_posts", type=int)
    def create_user_with_posts(email, num_posts):
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"User with email {email} already exists.")
            return

        user = User(
            email=email,
            password="abc123",
            is_active=True
        )
        db.session.add(user)
        db.session.commit()

        for i in range(1, num_posts + 1):
            post = Post(
                data={
                    "title": f"Post #{i}",
                    "content": f"This is content for post #{i}"
                },
                user=user
            )
            db.session.add(post)

        db.session.commit()
        print(f"User '{email}' created with {num_posts} posts.")