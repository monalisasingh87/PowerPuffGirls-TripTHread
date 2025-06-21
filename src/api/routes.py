"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Message
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

# @api.route("/user", methods=["GET"])
# def get_user():
#     messages = Message.query.all()
#     all_messages = list(map(lambda x: x.serialize(), messages))
#     return jsonify(all_messages), 200


@api.route('/contactus', methods=['POST'])
# @jwt_required()
def post_message():
    data = request.get_json()
    # current_user_id = get_jwt_identity()
    current_user_id = 1
    name = data.get("message_name")
    email = data.get("message_email")
    content = data.get("content")

    if not all([name, email, content]):
        return jsonify({"error": "missing required fields"}), 400

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
