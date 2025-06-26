"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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



