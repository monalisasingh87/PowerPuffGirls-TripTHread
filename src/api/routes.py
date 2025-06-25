"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Post, PostImage
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token


api = Blueprint('api', __name__)
CORS(api)

@api.route('/journals', methods=['POST'])
@jwt_required()
def create_journal():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    post = Post(title=title, content=content, user_id=user.id, username=user.username)
    db.session.add(post)
    db.session.commit()

    return jsonify(post.serialize()), 201

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
    current_user_id = get_jwt_identity()
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
    current_user_id = get_jwt_identity()
    post = Post.query.get(post_id)

    if not post or post.user_id != current_user_id:
        return jsonify({"error": "Unauthorized or not found"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200

@api.route('/journals/<int:post_id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(post_id, image_id):
    current_user_id = get_jwt_identity()
    post = Post.query.get(post_id)
    image = PostImage.query.get(image_id)

    if not post or not image or post.user_id != current_user_id or image.post_id != post.id:
        return jsonify({"error": "Unauthorized or not found"}), 403

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200

@api.route("/login", methods=["POST"])
def login():
    
    # login credentials
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # query the DB to check if the user email exists
    email = email.lower()
    user = User.query.filter_by(email=email).first()

    # create a condition if the user does NOT exist or if the password is wrong
    if user is None:
        return jsonify({'message': 'Sorry email or password not found'}), 401
    elif user is not None and user.password != password:
        return jsonify({'message': 'Sorry email or password not found'}), 401
    
    # the user DOES exist and the passwords matched
    access_token = create_access_token(identity=user.id)

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

    #checking if the email exist
    email = email.lower()
    user = User.query.filter_by(email=email).first()

    #check iif the email exist
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
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200



