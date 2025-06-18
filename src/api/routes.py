"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Post, PostImage
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")  # Note: hash this in production

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Check if username or email already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    user = User(
        username=username,
        email=email,
        password=password,
        is_active=True
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


@api.route('/journals', methods=['POST'])
@jwt_required()
def create_journal():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title")
    content = data.get("content")
    image_urls = data.get("images", [])  # optional list of image URLs

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    # Fetch user object
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Create post with user relationship
    new_post = Post(data=data, user=user)

    # Handle optional image uploads
    for url in image_urls:
        if url.strip():
            new_post.images.append(PostImage(image_url=url))

    # Save to DB
    db.session.add(new_post)
    db.session.commit()

    return jsonify(new_post.serialize()), 201
