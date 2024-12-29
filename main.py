from flask_cors import CORS
import db
from flask import Flask, render_template, request, redirect, url_for
import models
from dotenv import load_dotenv
import os
from routes import api

load_dotenv()  # Cargar el archivo .env
backend_url = os.getenv('BACKEND_URL')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3001"}})


# Registra el Blueprint
app.register_blueprint(api, url_prefix='/api')

@app.route("/")
def home():
    return "holi"

if __name__ == '__main__':
    # Crea todas las tablas si no existen
    db.Base.metadata.create_all(db.engine)
    app.run(debug=True, host='0.0.0.0', port=5000)
