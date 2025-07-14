"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from api.models import db, User, Post, PostImage, Message
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)


@api.route("/ping")
def ping():
    return jsonify({"message": "pong"})


@api.route('/journals', methods=['POST'])
@jwt_required()
def create_journal():
    current_user_id = get_jwt_identity()
    # print("JWT user ID:", current_user_id)
    # print("Current user ID:", current_user_id)

    data = request.get_json()
    print("POST body:", data)
    print("data.title", data['title'])

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 422

    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    post = Post(title=title, content=content, user=user)
    db.session.add(post)
    db.session.commit()

    return jsonify({
        "id": post.id,
        "message": "Post created successfully",
        **post.serialize()  # optionally return full post data
    }), 201

    # Exception as e:
    #     print("POST /journals error:", e)
    #     return jsonify({"error": "Server error"}), 500


@api.route('/journals/<int:post_id>/images', methods=['POST'])
@jwt_required()
def upload_image(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    image_url = f"https://fakeimage.com/{image.filename}"

    post_image = PostImage(post_id=post.id, image_url=image_url)
    db.session.add(post_image)
    db.session.commit()

    return jsonify(post_image.serialize()), 201


@api.route('/journals/<int:post_id>', methods=['PUT'])
@jwt_required()
def edit_journal(post_id):
    current_user_id = int(get_jwt_identity())
    post = Post.query.get(post_id)

    if not post or post.user_id != current_user_id:
        return jsonify({"error": "Unauthorized or not found"}), 403

    data = request.get_json()
    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)

    db.session.commit()
    return jsonify(post.serialize()), 200


@api.route('/journals/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_journal(post_id):
    current_user_id = int(get_jwt_identity())
    post = Post.query.get(post_id)

    if not post or post.user_id != current_user_id:
        return jsonify({"error": "Unauthorized or not found"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200


@api.route('/journals/<int:post_id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(post_id, image_id):
    current_user_id = int(get_jwt_identity())
    post = Post.query.get(post_id)
    image = PostImage.query.get(image_id)

    if not post or not image or post.user_id != current_user_id or image.post_id != post.id:
        return jsonify({"error": "Unauthorized or not found"}), 403

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200


@api.route('/user/posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    current_user_id = int(get_jwt_identity())
    posts = Post.query.filter_by(user_id=current_user_id).all()
    return jsonify([post.serialize() for post in posts]), 200


@api.route('/journals', methods=['GET'])
def get_all_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.serialize() for post in posts]), 200


@api.route('/journals/<int:post_id>', methods=['GET'])
def get_single_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200


@api.route('/contactus', methods=['POST'])
@jwt_required(optional=True)
def post_message():
    try:
        data = request.get_json()
        print("Incoming data:", data)
        current_user_id = get_jwt_identity()
        # current_user_id = 1
        name = data.get("message_name")
        email = data.get("message_email")
        content = data.get("content")

        if not content or content.strip() == "":
            return jsonify({"error": "missing content"}), 400

        if not current_user_id:
            if not name or not email:
                return jsonify({"error": "name and email are required for guests"}), 400
        else:
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({"error": "User not found"}), 404
            # name = user.name
            email = user.email
            if not name:
                name = email.split("@")[0]

        new_message = Message(
            message_name=name,
            message_email=email,
            content=content,
            user_id=current_user_id
        )
        db.session.add(new_message)
        db.session.commit()

        # Send email
        # msg = MailMessage(
        #     subject=f"New message from {name}",
        #     sender=os.getenv("EMAIL_USER"),
        #     recipients=[os.getenv("EMAIL_USER")],  # send to yourself
        #     body=f"From: {name} <{email}>\n\nMessage:\n{content}"
        # )
        # mail.send(msg)

        return jsonify({"message": "Message received"}), 201

    except Exception as e:
        print("❌ Error in /contactus:", e, type(e))
        return jsonify({"error": "Server error"}), 500


@api.route("/login", methods=["POST"])
def login():

    # login credentials
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    email_value = email.lower()
    user = User.query.filter_by(email=email_value).first()

    if user is None:
        return jsonify({'message': 'Sorry email or password not found'}), 401
    elif user is not None and user.password != password:
        return jsonify({'message': 'Sorry email or password not found'}), 401

    # the user DOES exist and the passwords matched
    access_token = create_access_token(identity=str(user.id))

    response = {
        'access_token': access_token,
        'user_id': user.id,
        'email': user.email,
        'message': f'Welcome {user.email}!'
    }

    return jsonify(response), 200


@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get('email')
    password = request.json.get('password')

    # checking if the email exist
    email = email.lower()
    user = User.query.filter_by(email=email).first()

    # check iif the email exist
    if user is not None and user.email == email:
        response = {
            "message": f"{user.email} already exist. Please log in."
        }
        return jsonify(response), 403

    new_user = User()
    new_user.email = email
    new_user.password = password
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()

    response = {
        "message": f"You have successfully Signed up!, Now please login to enter to your account as a {new_user.email}"
    }
    return jsonify(response), 201


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/homepage", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
