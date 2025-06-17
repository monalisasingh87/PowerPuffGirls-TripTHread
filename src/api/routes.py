"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post
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
@api.route('/post', methods=['POST'])
def handle_post_a_journal():
    body = request.get_json()

    user_id = body.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    post = Post(data=body, user=user)  # ✅ pass the User object
    db.session.add(post)
    db.session.commit()

    return jsonify(post.serialize()), 201
