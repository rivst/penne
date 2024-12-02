import os
import base64
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, render_template, session, g
from penne import auth, paste
from penne.crypto import encrypt_paste
import penne.firebase_admin
from penne.paste import construct_expiry_values
from .asset import Asset

load_dotenv()

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.secret_key = FLASK_SECRET_KEY
    Asset(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(paste.bp)

    @app.template_filter()
    def format_time(value):
        return value.strftime("%d.%m.%Y %H:%M")

    @app.route("/")
    def index():
        is_anonymous_user = g.user is None
        return render_template(
            "home.jinja",
            expiry_options=construct_expiry_values(is_anonymous_user),
        )

    return app
