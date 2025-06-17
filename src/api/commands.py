
import click
from api.models import db, User, Post

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """

    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    
    @app.cli.command("create-user-with-posts")
    @click.argument("email")
    @click.argument("num_posts", type=int)
    def create_user_with_posts(email, num_posts):
        # Create a new user
        user = User(email=email, password="abc123", is_active=True)
        db.session.add(user)
        db.session.commit()

        # Create multiple posts
        for i in range(1, num_posts + 1):
            post = Post(
                data={
                    "title": f"Post #{i}",
                    "content": f"This is content for post #{i}",
                    "user_id": user.id
                }
            )
            db.session.add(post)

        db.session.commit()
        print(f"User '{email}' created with {num_posts} posts.")