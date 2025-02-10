from flask_cors import CORS
import db
from flask import Flask
from routes import api
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager



app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "judit_mejor_bartender_mundial"  # Cambia esto por una clave segura
jwt = JWTManager(app)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Registra el Blueprint
app.register_blueprint(api, url_prefix='/api')

@app.route("/")
def home():
    return "holi"

if __name__ == '__main__':
    # Crea todas las tablas si no existen
    db.Base.metadata.create_all(db.engine)
    app.run(debug=True, host='0.0.0.0', port=5000)
